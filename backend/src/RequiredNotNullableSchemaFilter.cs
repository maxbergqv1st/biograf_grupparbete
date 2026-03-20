using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace WebApp;

public class RequiredNotNullableSchemaFilter : ISchemaFilter
{
    public void Apply(IOpenApiSchema schema, SchemaFilterContext context)
    {
        if (schema.Properties == null) return;
        if (schema.Required == null) return;

        foreach (var (name, property) in schema.Properties)
        {
            if (property.Type is { } type && !type.HasFlag(JsonSchemaType.Null))
            {
                schema.Required.Add(name);
            }

        }
    }
}