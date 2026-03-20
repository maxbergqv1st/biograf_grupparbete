using CloudinaryDotNet;
using dotenv.net;

namespace WebApp;

public static class CloudinaryConfig
{
    public static Cloudinary Create()
    {
        DotEnv.Load(options: new DotEnvOptions(probeForEnv: true));
        var cloudinaryUrl = Environment.GetEnvironmentVariable("CLOUDINARY_URL");
        if (string.IsNullOrWhiteSpace(cloudinaryUrl))
            throw new Exception("CLOUDINARY_URL saknas i backend/.env");

        var cloudinary = new Cloudinary(cloudinaryUrl);
        cloudinary.Api.Secure = true;
        return cloudinary;
    }
}
