namespace WebApp;

public static class DbQuery
{
    // Setup the database connection from config
    private static string connectionString;

    // JSON columns for _CONTAINS_ validation
    public static Arr JsonColumns = Arr(new[] { "categories" });

    public static bool IsJsonColumn(string column) => JsonColumns.Includes(column);

    static DbQuery()
    {
        connectionString = BuildConnectionString();
    }

    private static string BuildConnectionString()
    {
        var configPath = Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "db-config.json"
        );
        var config = JSON.Parse(File.ReadAllText(configPath));
        return $"Server={config.host};Port={config.port};Database={config.database};" +
               $"User={config.username};Password={config.password};";
    }

    // I think tht Migrations should be the separate class, but not sure what to do with a connection strings in this case.
    // TODO: Investigate and find a better way.
    public static void RunMigrations()
    {
        var connStr = BuildConnectionString();

        using var connection = new MySqlConnection(connStr);
        var evolve = new EvolveDb.Evolve(connection, msg => Console.WriteLine(msg))
        {
            Locations = new[] { "backend/db/migrations/schema", "backend/db/migrations/seeds" },
            IsEraseDisabled = true
        };
        evolve.Migrate();
    }

    // Helper to create an object from the DataReader
    private static dynamic ObjFromReader(MySqlDataReader reader)
    {
        var obj = Obj();
        for (var i = 0; i < reader.FieldCount; i++)
        {
            var key = reader.GetName(i);
            var value = reader.GetValue(i);

            // Handle NULL values
            if (value == DBNull.Value)
            {
                obj[key] = null;
            }
            // Handle DateTime - convert to ISO string
            else if (value is DateTime dt)
            {
                obj[key] = dt.ToString("yyyy-MM-ddTHH:mm:ss");
            }
            // Handle boolean (MySQL returns sbyte for TINYINT(1))
            else if (value is sbyte sb)
            {
                obj[key] = sb != 0;
            }
            else if (value is bool b)
            {
                obj[key] = b;
            }
            // Handle JSON columns (MySQL returns JSON as string starting with [ or {)
            else if (value is string strValue && (strValue.StartsWith("[") || strValue.StartsWith("{")))
            {
                try
                {
                    obj[key] = JSON.Parse(strValue);
                }
                catch
                {
                    // If parsing fails, keep the original value and try to convert to number
                    obj[key] = strValue.TryToNum();
                }
            }
            else
            {
                // Normal handling - convert to string and try to parse as number
                obj[key] = value.ToString().TryToNum();
            }
        }
        return obj;
    }

    // Run a query - rows are returned as an array of objects
    public static Arr SQLQuery(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        var paras = parameters == null ? Obj() : Obj(parameters);
        using var db = new MySqlConnection(connectionString);
        db.Open();
        var command = db.CreateCommand();
        command.CommandText = @sql;
        var entries = (Arr)paras.GetEntries();
        entries.ForEach(x => command.Parameters.AddWithValue("@" + x[0], x[1]));
        if (context != null)
        {
            DebugLog.Add(context, new
            {
                sqlQuery = sql.Regplace(@"\s+", " "),
                sqlParams = paras
            });
        }
        var rows = Arr();
        try
        {
            if (sql.StartsWith("SELECT ", true, null))
            {
                var reader = command.ExecuteReader();
                while (reader.Read())
                {
                    rows.Push(ObjFromReader(reader));
                }
                reader.Close();
            }
            else
            {
                rows.Push(new
                {
                    command = sql.Split(" ")[0].ToUpper(),
                    rowsAffected = command.ExecuteNonQuery()
                });
            }
        }
        catch (Exception err)
        {
            rows.Push(new { error = err.Message });
        }
        return rows;
    }

    // Run a query - only return the first row, as an object
    public static dynamic SQLQueryOne(
        string sql, object parameters = null, HttpContext context = null
    )
    {
        return SQLQuery(sql, parameters, context)[0];
    }
}
