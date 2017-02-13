version 1: directly write to the DOM

version 2:
you should not write to dom directly

save the state of the game to some objects
create a render function to produce html to be inserted into the dom

when the source of truth is the DOM, pull it out and save it in an js object
separate the state of the game from UI

problem: how to deal with the state of your app along with the browser's state (eg: where the cursur is)
         how to do partial page rendering

version 3:
use a library for the render logic
use react.js

All React components must act like pure functions with respect to their props

There are two types of data that control a component: props and state
props are set by the parent and they are fixed throughout the lifetime of a component
For data that is going to change, we have to use state