# Logo for naturvernområder

Kilde: Designmanual for Norges nasjonalparker https://designmanual.norgesnasjonalparker.no/logo/retningslinjer-for-logo

Finner ingen logo der i vektorformat.

## Vektorisering av raster-logo

* Laster ned PNG logo fra https://designmanual.norgesnasjonalparker.no/uploads/zips/NN_Logosymbol_SosialeMedier.png.zip
* Pakk ut arkivet
* Trim white space rundt bildet
* Vektoriser bitmapfil

### Script

```sh
wget https://designmanual.norgesnasjonalparker.no/uploads/zips/NN_Logosymbol_SosialeMedier.png.zip
unzip NN_Logosymbol_SosialeMedier.png.zip
convert NN_Logosymbol_SosialeMedier.png -trim logo.bmp
potrace -s logo.bmp
convert -background transparent -resize 40x40 logo.svg avatar_40.png
```

