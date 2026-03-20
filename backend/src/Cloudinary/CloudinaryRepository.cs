using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace WebApp;

public class CloudinaryRepository : ICloudinaryRepository
{
    public async Task<(string Url, string PublicId)> UploadPosterAsync(
        IFormFile file,
        string folder,
        string publicId,
        CancellationToken ct
    )
    {
        var cloudinary = CloudinaryConfig.Create();
        await using var stream = file.OpenReadStream();
        var upload = await cloudinary.UploadAsync(new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = folder,
            PublicId = publicId,
            Overwrite = true,
            Invalidate = true
        });

        if (upload.Error is not null)
            throw new Exception(upload.Error.Message);

        return (upload.SecureUrl?.ToString() ?? "", upload.PublicId);
    }

    public async Task DeleteByPublicIdAsync(string publicId, CancellationToken ct)
    {
        var cloudinary = CloudinaryConfig.Create();
        var result = await cloudinary.DestroyAsync(new DeletionParams(publicId)
        {
            ResourceType = ResourceType.Image
        });

        if (result.Error is not null)
            throw new Exception(result.Error.Message);
    }
}
