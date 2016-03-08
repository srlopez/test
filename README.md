Test on React Native with Redux and issues on ListView
========================

Just a simple one file code src/App.js to test the issues

### The App ###

Using Redux and react-redux to store the simple state of a index and a list of objects.
You can add new items Clicking on 'add' button, and you can update the item status o remove the item clicking on plus or minus to set the index and then 'remove or 'update'

You can Press or LongPress on Items but .....

### Issues ###

If you press the 'green' button (update or remove), the redux reducer function does not behave in the same way as if you press (update or remove) in the menu item (longPress), or in the item (Press).

The behavior is that the redux reducer function delete all items from the above of the index, but with the green buttons is the desired behavior

##### clone this repo: #####

Because react is included in react-native, there are some problems of overlap and redux does not work. So you have to erase some duplications 'npm run reset'

```
$ cd test
$ //npm i //included in the next command
$ npm run reset
$ open ios/App.xcodeproj
```

Click on the play/run button in Xcode.
<br />
Open the directory in the text editor of your choice.

![alt tag](https://github.com/srlopez/test/blob/master/ScreenShot.png)
