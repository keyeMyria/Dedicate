package com.dedicate;

//Android Imports
import android.app.Application;

//React Native Imports
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

//Splash Screen Imports
import org.devio.rn.splashscreen.SplashScreenReactPackage;

//Realm Imports
import io.realm.react.RealmReactPackage;

//Svg Imports
import com.horcrux.svg.SvgPackage;
import com.rnfs.RNFSPackage;

//Google Maps Imports
import com.airbnb.android.react.maps.MapsPackage;

//Geolocation Imports
import com.devfd.RNGeocoder.RNGeocoderPackage;

//ZIP Imports
import com.rnziparchive.RNZipArchivePackage;

//Document Picker Imports
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;

//File Utilities Imports
import com.anumang.rnfileutils.RNFUPackage;

//Java Imports
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new SplashScreenReactPackage(),
          new RealmReactPackage(),
          new SvgPackage(),
          new RNFSPackage(),
          new MapsPackage(),
          new RNGeocoderPackage(),
          new RNZipArchivePackage(),
          new ReactNativeDocumentPicker(),
          new RNFUPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
