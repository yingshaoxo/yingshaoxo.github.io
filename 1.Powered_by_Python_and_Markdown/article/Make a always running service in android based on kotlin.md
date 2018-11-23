### 0. What is `service`?
You could see `service` as a always running program

But by default, a service runs in the same process as the main thread of the application

Therefore, you need to use asynchronous processing in the service to perform resource intensive tasks in the background
___

### 1. Basic idea or resources
Official but you can't understand: [Google Developer Guide](https://developer.android.com/training/run-background-service/create-service.html)

Unofficial but reachable: [tutorials_point](https://www.tutorialspoint.com/android/android_services.htm)
___

### 2. Getting started
+ Create a kotlin file which names `MyService.kt`, and put the following codes in:
```
class MyService : Service() {
    @Nullable
    override fun onBind(intent: Intent): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Let it continue running until it is stopped.
        Toast.makeText(this, "Service Started", Toast.LENGTH_LONG).show()
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        Toast.makeText(this, "Service Destroyed", Toast.LENGTH_LONG).show()
    }
}
```

+ Change `AndroidManifast.xml`, add following after `</activity>`:
```
<service android:name=".MyService" />
```

+ Add following to a `.kt` file(means right in main_activity) where you wanna call your `service`
```
    // The View is just a widget in your UI xml

    fun startService(view: View) {
        startService(Intent(baseContext, MyService::class.java))
    }

    fun stopService(view: View) {
        stopService(Intent(baseContext, MyService::class.java))
    }
```
___

### 3. Good to go
Now you are able to run your `service` using `startService(your_layout_id)` function

Example: https://github.com/yingshaoxo/Offline_Netease_MusicPlayer

Have fun!
