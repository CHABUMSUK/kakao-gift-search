package kr.growther.giftsearch;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.SystemClock;
import android.webkit.CookieManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.webkit.WebViewCompat;
import androidx.webkit.WebViewFeature;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MainActivity extends Activity {
    private static final String HOME = "https://gift.kakao.com/home";
    // PC(데스크톱) 브라우저처럼 보이게 해서, 휴대폰용 선물하기가 카톡 앱으로 튕기는 것을 막음
    private static final String DESKTOP_UA =
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36";

    // 페이지 스크립트보다 먼저 실행: 앱 내장 브라우저의 "모바일" 신호(userAgentData.mobile 등)를 PC 값으로 바꿈
    private static final String DESKTOP_SPOOF =
        "(function(){try{" +
        "var d={brands:[{brand:'Chromium',version:'129'},{brand:'Google Chrome',version:'129'},{brand:'Not=A?Brand',version:'8'}],mobile:false,platform:'Windows'," +
        "getHighEntropyValues:function(){return Promise.resolve({brands:d.brands,mobile:false,platform:'Windows',platformVersion:'10.0.0',model:'',architecture:'x86',bitness:'64',uaFullVersion:'129.0.0.0',fullVersionList:d.brands});}," +
        "toJSON:function(){return {brands:d.brands,mobile:false,platform:'Windows'};}};" +
        "Object.defineProperty(Navigator.prototype,'userAgentData',{get:function(){return d;},configurable:true});" +
        "Object.defineProperty(Navigator.prototype,'maxTouchPoints',{get:function(){return 0;},configurable:true});" +
        "Object.defineProperty(Navigator.prototype,'platform',{get:function(){return 'Win32';},configurable:true});" +
        "}catch(e){}})();";

    private WebView web;
    private String js;
    private boolean spoofReady = false;
    private final List<String> nav = new ArrayList<>();
    private long lastRedirectAt = 0;
    private int redirectCount = 0;

    private void log(String s) {
        if (s == null) return;
        if (s.length() > 110) s = s.substring(0, 110);
        synchronized (nav) {
            nav.add(s);
            while (nav.size() > 14) nav.remove(0);
        }
    }

    // 진단용: 최근 이동한 주소와 쿠키 이름을 화면에 보여주기 위함
    public class Bridge {
        @JavascriptInterface
        public String navLog() {
            synchronized (nav) { return String.join("\n", nav); }
        }

        @JavascriptInterface
        public String cookieNames(String url) {
            String c = CookieManager.getInstance().getCookie(url);
            if (c == null) return "(없음)";
            StringBuilder sb = new StringBuilder();
            for (String part : c.split(";")) {
                String name = part.trim().split("=", 2)[0];
                if (sb.length() > 0) sb.append(",");
                sb.append(name);
            }
            return sb.toString();
        }

        @JavascriptInterface
        public String info() {
            return "spoof=" + spoofReady;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        js = readAsset("kgx.js");
        web = new WebView(this);
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setUserAgentString(DESKTOP_UA);
        s.setUseWideViewPort(false);
        s.setLoadWithOverviewMode(false);
        s.setTextZoom(100);
        s.setJavaScriptCanOpenWindowsAutomatically(true);

        CookieManager cm = CookieManager.getInstance();
        cm.setAcceptCookie(true);
        cm.setAcceptThirdPartyCookies(web, true);

        web.addJavascriptInterface(new Bridge(), "KGX");

        if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
            try {
                WebViewCompat.addDocumentStartJavaScript(web, DESKTOP_SPOOF, Collections.singleton("*"));
                spoofReady = true;
            } catch (Exception e) {
                spoofReady = false;
            }
        }

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                return handle(req.getUrl().toString());
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                log("> " + url);
                if (!spoofReady) view.evaluateJavascript(DESKTOP_SPOOF, null);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                CookieManager.getInstance().flush();
                Uri u = Uri.parse(url);
                if ("gift.kakao.com".equals(u.getHost()) && js != null) {
                    view.evaluateJavascript(js, null);
                }
            }
        });

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl(HOME);
    }

    // 카톡 앱 열기 링크(intent:, kakaotalk:)는 직접 카톡을 실행
    private boolean handle(String url) {
        log("~ " + url);
        try {
            if (url.startsWith("intent:")) {
                Intent i = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
                i.addCategory(Intent.CATEGORY_BROWSABLE);
                i.setComponent(null);
                startActivity(i);
                return true;
            }
            if (url.startsWith("kakaotalk:") || url.startsWith("kakaokompassauth:") || url.startsWith("market:")) {
                startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                return true;
            }
            // gift-talk 연결 페이지(카톡 앱으로 보내는 곳)는 앱 안에서 처리. 무한 반복은 막음
            if (url.contains("gift-talk.kakao.com")) {
                long now = SystemClock.elapsedRealtime();
                redirectCount = (now - lastRedirectAt < 8000) ? redirectCount + 1 : 1;
                lastRedirectAt = now;
                if (redirectCount > 2) {
                    Toast.makeText(this, "선물하기가 카톡 앱으로 보내려 해서 멈췄어요", Toast.LENGTH_LONG).show();
                    return true;
                }
                Uri u = Uri.parse(url);
                String to = u.getQueryParameter("to");
                web.loadUrl(to != null && to.startsWith("https://gift.kakao.com") ? to : HOME);
                return true;
            }
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, "열 수 있는 앱이 없어요", Toast.LENGTH_SHORT).show();
            return true;
        } catch (Exception e) {
            Toast.makeText(this, "열 수 없는 링크예요", Toast.LENGTH_SHORT).show();
            return true;
        }
        return false;
    }

    @Override
    protected void onResume() {
        super.onResume();
        // 카톡에서 돌아오면 검색창 다시 보이기
        if (web != null && js != null) web.evaluateJavascript(js, null);
    }

    @Override
    protected void onPause() {
        super.onPause();
        CookieManager.getInstance().flush();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    private String readAsset(String name) {
        try (InputStream in = getAssets().open(name)) {
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) bo.write(buf, 0, n);
            return bo.toString(StandardCharsets.UTF_8.name());
        } catch (Exception e) {
            return null;
        }
    }
}
