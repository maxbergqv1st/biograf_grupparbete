using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApp;

public static class CloudinaryEndpoints
{
    public static void MapCloudinaryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/movies")
            .WithTags("Cloudinary");

        group.MapPost("/{movieId:int}/poster", async (
                int movieId,
                [FromForm] IFormFile file,
                ICloudinaryRepository cloud,
                MySqlDataSource db,
                CancellationToken ct
            ) =>
            {
                if (file is null || file.Length == 0)
                    return Results.BadRequest(new { error = "No file provided (field name must be 'file')" });

                await using var conn = await db.OpenConnectionAsync(ct);
                string? existingPublicId;
                await using (var getCmd = conn.CreateCommand())
                {
                    getCmd.CommandText = "SELECT poster_url FROM movies WHERE id = @id";
                    getCmd.Parameters.AddWithValue("@id", movieId);
                    var result = await getCmd.ExecuteScalarAsync(ct);
                    if (result is null)
                        return Results.NotFound(new { error = "Movie not found" });
                    existingPublicId = result as string;
                }

                var folder = "filmer";
                var (url, publicId) = await cloud.UploadPosterAsync(file, folder, movieId, ct);

                await using var cmd = conn.CreateCommand();
                // Store Cloudinary publicId in movies.poster_url for SDK rendering
                cmd.CommandText = "UPDATE movies SET poster_url = @pid WHERE id = @id";
                cmd.Parameters.AddWithValue("@pid", publicId);
                cmd.Parameters.AddWithValue("@id", movieId);
                await cmd.ExecuteNonQueryAsync(ct);

                if (!string.IsNullOrWhiteSpace(existingPublicId) && existingPublicId != publicId)
                {
                    try
                    {
                        await cloud.DeleteByPublicIdAsync(existingPublicId, ct);
                    }
                    catch
                    {
                        return Results.Ok(new { movieId, publicId, warning = "Poster updated, but previous image could not be deleted." });
                    }
                }

                return Results.Ok(new { movieId, publicId });
            })
            .WithSummary("Upload movie poster")
            .WithDescription("Uploads a poster to Cloudinary and stores the publicId in movies.poster_url")
            .Accepts<IFormFile>("multipart/form-data")
            .DisableAntiforgery()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{movieId:int}/poster", async (
                int movieId,
                ICloudinaryRepository cloud,
                MySqlDataSource db,
                CancellationToken ct
            ) =>
            {
                await using var conn = await db.OpenConnectionAsync(ct);
                string? publicId;
                await using (var getCmd = conn.CreateCommand())
                {
                    getCmd.CommandText = "SELECT poster_url FROM movies WHERE id = @id";
                    getCmd.Parameters.AddWithValue("@id", movieId);
                    var result = await getCmd.ExecuteScalarAsync(ct);
                    if (result is null)
                        return Results.NotFound(new { error = "Movie not found" });
                    publicId = result as string;
                }

                if (!string.IsNullOrWhiteSpace(publicId))
                {
                    await cloud.DeleteByPublicIdAsync(publicId, ct);
                }

                await using var cmd = conn.CreateCommand();
                cmd.CommandText = "UPDATE movies SET poster_url = NULL WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", movieId);
                await cmd.ExecuteNonQueryAsync(ct);

                return Results.Ok(new { movieId, posterUrl = (string?)null });
            })
            .WithSummary("Remove movie poster")
            .WithDescription("Deletes the Cloudinary asset and clears movies.poster_url.")
            .DisableAntiforgery()
            .Produces(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }
}
