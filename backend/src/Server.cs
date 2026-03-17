using WebApp.Halls;
using WebApp.Screenings;
using WebApp.Seats;

namespace WebApp;

public static class Server
{
    public static void Start()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(option =>
        {
            option.SupportNonNullableReferenceTypes();
            option.SchemaFilter<RequiredNotNullableSchemaFilter>();

            option.SwaggerDoc("v1", new() { Title = "Biograf API V1", Version = "v1", Description = "Session + ACL based API" });
            option.SwaggerDoc("v2", new() { Title = "Biograf API V2", Version = "v2", Description = "JWT based API" });

            option.DocInclusionPredicate((docName, apiDesc) =>
            {
                var path = apiDesc.RelativePath ?? "";
                return docName switch
                {
                    "v1" => path.StartsWith("api/v1"),
                    "v2" => path.StartsWith("api/v2"),
                    _ => false
                };
            });
        });
        var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
        var configJson = File.ReadAllText(configPath);
        var config = System.Text.Json.JsonDocument.Parse(configJson).RootElement;
        var connectionString =
            $"Server={config.GetProperty("host").ToString()};" +
            $"Port={config.GetProperty("port").ToString()};" +
            $"Database={config.GetProperty("database").ToString()};" +
            $"User={config.GetProperty("username").ToString()};" +
            $"Password={config.GetProperty("password").ToString()};";
        builder.Services.AddMySqlDataSource(connectionString);
        builder.Services.AddSingleton<IJwtService, JwtService>();
        builder.Services.AddScoped<IMovieRepository, MovieRepository>();
        builder.Services.AddScoped<IScreeningRepository, ScreeningRepository>();
        builder.Services.AddScoped<ICloudinaryRepository, CloudinaryRepository>();
        builder.Services.AddScoped<IAuthRepository, AuthRepository>();
        builder.Services.AddScoped<IHallRepository, HallRepository>();

        builder.Services.AddScoped<ISeatsRepository, SeatsRepository>();
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("V2", policy =>
            {
                policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
            });
        });

        App = builder.Build();

        if (App.Environment.IsDevelopment())
        {
            App.UseSwagger();
            App.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "V1");
                options.SwaggerEndpoint("/swagger/v2/swagger.json", "V2");
            });
        }
        // Shared
        App.UseCors();
        ErrorHandler.Start();
        DebugLog.Start();

        Middleware();

        // V1
        Acl.Start();
        Session.Start();
        LoginRoutes.Start();
        RestApi.Start();
        FileServer.Start();

        // V2
        App.UseJwtAuth();
        App.MapAuthEndpoints();
        App.MapMovieEndpoints();
        App.MapScreeningEndpoints();
        App.MapCloudinaryEndpoints();
        App.MapHallEndpoints();
        App.MapSeatsEndpoints();
        var runUrl = "http://localhost:" + Globals.port;
        Log("Server running on:", runUrl);
        Log("With these settings:", Globals);
        App.Run(runUrl);

    }



    // Middleware that changes the server response header,
    // initiates the debug logging for the request,
    // keep sessions alive, stops the route if not acl approved
    // and adds some info for debugging
    public static void Middleware()
    {
        App.Use(async (context, next) =>
        {
            context.Response.Headers.Append("Server", (string)Globals.serverName);
            DebugLog.Register(context);

            var path = context.Request.Path.Value ?? "";
            var isV2 = path.StartsWith("/api/v2/");

            if (!isV2)
            {
                Session.Touch(context);
                if (!Acl.Allow(context))
                {
                    context.Response.StatusCode = 405;
                    var error = new { error = "Not allowed." };
                    DebugLog.Add(context, error);
                    await context.Response.WriteAsJsonAsync(error);
                    return;
                }
            }

            await next(context);

            // Add some extra info for debugging
            var res = context.Response;
            var contentLength = res.ContentLength ?? 0;
            var info = Obj(new
            {
                statusCode = res.StatusCode,
                contentType = res.ContentType,
                contentLengthKB =
                    Math.Round((double)contentLength / 10.24) / 100,
                RESPONSE_DONE = Now
            });
            if (info.contentLengthKB == null || info.contentLengthKB == 0)
            {
                info.Delete("contentLengthKB");
            }
            DebugLog.Add(context, info);
        });
    }
}
