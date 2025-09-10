var desktopArray = desktops();
for (var i=0; i < desktopArray.length; ++i) {
  var d = desktopArray[i];
  d.wallpaperPlugin = "org.kde.image";
  d.currentConfigGroup = ["Wallpaper", "org.kde.image", "General"];
  d.writeConfig("Image","file:///usr/share/wallpapers/mydistro/wallpaper3.png");
  d.writeConfig("FillMode",2);
}
