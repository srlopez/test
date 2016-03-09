Quiz - on React Native with Redux
========================

Just a simple one file code src/App.js to test the issues.
Well now two files, I made a component to reduce code in the main App, just a EasyButton

### The App ###

Is a Simple Redux State of a index and a list of { name: "text", status: "boolean" }
The app show the list of items, then you can press on buttons:

  * add: to add some new items,
  * +/-: to address the index to the item you choose
  * update: to update the item status of the selected item (within index)
  * remove: to delete from list

On a item you can:

  * press: to update the status
  * long press: to choose update or remove.

All the button, or the press on a item dispatch the same actions.

And that's all

### If you want to test the Quiz ###

After clone this repo, do this to see the Quiz

   1. click 3 on 'add' , to add some new items
   2. click 3 on '+', to move the index to #3
   3. click 'update', and you can see the item changed
   4. press on item #3, and you can see how the remaining items are deleted

The redux trace, show how the action type UPDATE behaves different if is invoked from the button 'update', or invoked from the 'press' on item.

### Setup ###
#### clone this repo: ####

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


### Solution ###

Nobody knows
