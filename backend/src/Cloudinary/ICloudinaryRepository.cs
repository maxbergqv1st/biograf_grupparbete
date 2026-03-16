using Microsoft.AspNetCore.Http;

namespace WebApp;

public interface ICloudinaryRepository
{
    Task<(string Url, string PublicId)> UploadPosterAsync(
        IFormFile file,
        string folder,
        string publicId,
        CancellationToken ct
    );

    Task DeleteByPublicIdAsync(string publicId, CancellationToken ct);
}
