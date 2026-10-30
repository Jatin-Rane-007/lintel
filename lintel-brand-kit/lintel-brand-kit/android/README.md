# Lintel Android icon

Copy `res/` into `app/src/main/res/` (merge folders).

- `drawable/ic_launcher_background.xml`: solid Ink `#141413`, 108 x 108 dp.
- `drawable/ic_launcher_foreground.xml`: Paper structure with the Ember point, kept inside the central 66 dp safe zone.
- `drawable/ic_launcher_monochrome.xml`: single-color layer for themed icons (Android 13+). The point is a separate shape inside the opening.
- `mipmap-anydpi-v26/ic_launcher.xml` and `ic_launcher_round.xml`: adaptive icon definitions.
- `mipmap-*/ic_launcher.png`: fallback PNGs for older devices (48, 72, 96, 144, 192 px).
- `play-store/lintel-play-store-512.png`: 512 x 512 for the Play Console. Upload it as a full square; Google applies the mask.

In `AndroidManifest.xml`: `android:icon="@mipmap/ic_launcher"` and `android:roundIcon="@mipmap/ic_launcher_round"`.
