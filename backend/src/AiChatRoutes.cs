using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;
using Dyndata;

namespace WebApp;

public record ChatRequest(List<Message> Messages);
public record Message(string Role, string Content);


public static class AiChatRoutes
{
  private static string? _aiAccessToken;
  private static string? _systemPrompt;

  static AiChatRoutes()
  {
    var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
    var configJson = File.ReadAllText(configPath);
    var config = JSON.Parse(configJson);
    _aiAccessToken = config.aiAccessToken;

    var promptPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "system-prompt.md");
    if (File.Exists(promptPath))
    {
      _systemPrompt = File.ReadAllText(promptPath);
    }
  }

  public static void Start()
  {
    App.MapPost("/api/v2/chat-endpoint", async (HttpContext context) =>
    {
      try
      {
        var req = await context.Request.ReadFromJsonAsync<ChatRequest>();
        if (req == null) return RestResult.Parse(context, new { error = "Invalid request" });
        var messages = req.Messages;

        if (_systemPrompt != null)
        {
          messages.Insert(0, new Message("system", _systemPrompt));
        }

        var payloadMessages = messages.Select(m => new { role = m.Role, content = m.Content }).ToList();
        var payload = new { model = "devstral-small-latest", messages = payloadMessages, temperature = 0.7 };

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _aiAccessToken);
        var response = await client.PostAsync("https://ai-api.nodehill.com/v1/chat/completions",
            new StringContent(JSON.Stringify(payload), Encoding.UTF8, "application/json"));

        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JSON.Parse(responseContent);

        return RestResult.Parse(context, result);
      }
      catch (Exception ex)
      {
        return RestResult.Parse(context, new { error = "AI chat error: " + ex.Message });
      }
    });
  }


}
