using MailKit.Net.Smtp;
using MimeKit;

namespace WebApp.Email;

public class EmailService : IEmailService
{
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _senderEmail;
    private readonly string _senderName;
    private readonly string _appPassword;

    public EmailService()
    {
        var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "email-config.json");
        var configJson = File.ReadAllText(configPath);
        var config = System.Text.Json.JsonDocument.Parse(configJson).RootElement;

        _smtpHost = config.GetProperty("smtpHost").GetString()!;
        _smtpPort = config.GetProperty("smtpPort").GetInt32();
        _senderEmail = config.GetProperty("senderEmail").GetString()!;
        _senderName = config.GetProperty("senderName").GetString()!;
        _appPassword = config.GetProperty("appPassword").GetString()!;
    }

    public async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_senderName, _senderEmail));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = htmlBody };

        using var client = new SmtpClient();
        await client.ConnectAsync(_smtpHost, _smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_senderEmail, _appPassword);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
