namespace MedSecurance.ProtocolEvaluator.PdfReport;

using PdfSharpCore.Fonts;

public sealed class EmbeddedFontResolver : IFontResolver
{
    public string DefaultFontName => "DejaVu Sans";

    public byte[] GetFont(string faceName)
    {
        var relativePath = faceName switch
        {
            "DejaVuSans#Regular"    => "Fonts/DejaVuSans.ttf",
            "DejaVuSans#Bold"       => "Fonts/DejaVuSans-Bold.ttf",
            "DejaVuSans#Italic"     => "Fonts/DejaVuSans-Oblique.ttf",
            "DejaVuSans#BoldItalic" => "Fonts/DejaVuSans-BoldOblique.ttf",
            _ => "Fonts/DejaVuSans.ttf"
        };

        var fullPath = Path.Combine(AppContext.BaseDirectory, relativePath);
        return File.ReadAllBytes(fullPath);
    }

    public FontResolverInfo ResolveTypeface(string familyName, bool isBold, bool isItalic)
    {
        if (isBold && isItalic) return new FontResolverInfo("DejaVuSans#BoldItalic");
        if (isBold)            return new FontResolverInfo("DejaVuSans#Bold");
        if (isItalic)          return new FontResolverInfo("DejaVuSans#Italic");
        return new FontResolverInfo("DejaVuSans#Regular");
    }
}