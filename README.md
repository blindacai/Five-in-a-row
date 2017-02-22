# tic tac toe -  sample React web app
#### Stuff used to make this:
* node + npm
* {[create-react-app](https://github.com/facebookincubator/create-react-app)} for app structure
* {[create-react-app-buildpack](https://github.com/mars/create-react-app-buildpack)} + Heroku for deployment

#### To run the app:
* src-v1: directly open it in the browser
* src: follow create-react-app's page; clone src over; npm start
* src-v2: rename it to src; npm start

#### Deploy:
* Make sure ```package.json``` is at the root of the project
* Open command line: ```heroku create app_name --buildpack https://github.com/mars/create-react-app-buildpack.git``` where app_name is your app's name
* Link heroku remote to git: ```git remote add heroku git@heroku.com:project.git``` where project should be the above app_name
* git commit all the changes
* ```git push heroku master```
* ```heroku open```

#### Notes and Resource:
Mainly based on 
{[Building React From Scratch](https://www.youtube.com/watch?v=pTHCwUdGFkc)} Youtube tutorial and 
{[Intro to React](https://facebook.github.io/react/tutorial/tutorial.html)} tutorial.
Below are some notes from the two sources

* version 1:

 	Directly write to the DOM

* version 2:

	You should not write to dom directly

	Save the state of the game to some objects

	Create a render function to produce html to be inserted into the dom

	When the source of truth is the DOM, pull it out and save it in an js object

	separate the state of the game from UI

	Problems: how to deal with the state of your app along with the browser's state (eg:  where the cursur is);
              how to do partial page rendering

* version 3:

	Use a library for the render logic

	Use react framework

	All React components must act like pure functions with respect to their props

    There are two types of data that control a component: props and state.
    props are set by the parent and they are fixed throughout the lifetime of a component.
    For data that is going to change, we have to use state. 
    {[props examples](https://facebook.github.io/react-native/docs/props.html)} 
    {[state examples](https://facebook.github.io/react-native/docs/state.html)}

    When you want to aggregate data from multiple children or to have two child components communicate with each other,
    move the state upwards so that it lives in the parent component. The parent can then pass the state back down to the children 
    via props, so that the child components are always in sync with each other and with the parent.

#### Readings:
{[const, let, var in JavaScript](https://medium.com/javascript-scene/javascript-es6-var-let-or-const-ba58b8dcde75#.ifdizjj7u)}

const means that the identifier(variable in this case) can’t be reassigned (it's read only),
but the object the identifier refer to can be mutable

So it looks similar to keyword final in Java

#### Questions
Why object being immutable is important?