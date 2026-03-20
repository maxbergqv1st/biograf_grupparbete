namespace WebApp.Email;

public class EmailConfig
{
    public string FrontendUrl { get; }

    public EmailConfig()
    {
        var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "email-config.json");
        var configJson = File.ReadAllText(configPath);
        var config = System.Text.Json.JsonDocument.Parse(configJson).RootElement;
        FrontendUrl = config.GetProperty("frontendUrl").GetString()!;
    }
}
