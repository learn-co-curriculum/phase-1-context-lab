# JavaScript Advanced Functions: Context

## Learning Goals

* Define execution context
* Define `this`
* Access implicitly-set global object in a JavaScript engine
* Access implicitly-set global object in a function call
* Prevent implicitly setting in function calls with `use strict`
* Access implicitly-set parent object in contained function expression
* Access implicitly-set new object in object-oriented programming constructor
* Explicitly override context with `call` and `apply`
* Explicitly lock context for a function with `bind`

## Introduction

In the previous lesson we provided definitions of:

* Execution Context
* `this`
* `call`
* `apply`
* `bind`

but then built an application which didn't use them. However, with a
record-oriented application built, we will have a shared context to understand
these challenging concepts in JavaScript.

## Define Execution Context

When a function in JavaScript ***is called***, it is provided an _execution
context_.

The _execution context_ is a JavaScript `Object` that is either implicitly or
explicitly passed along with the function at the time of the function's call.
The implicit way is something we have to memorize and accept as part of the
rules of JavaScript. The tools for explicitly passing a context at function
call-time are the methods `call`, `apply`, and `bind.`

## Define `this`

The JavaScript keyword `this` returns the current _execution context_. Whether
that context was passed explicitly or implicitly, `this` returns it. 

We'll now identify places where the _execution context_ is implicitly set.

### Access Implicitly-Set Global Object in a JavaScript Engine

```javascript
this //=> Window
typeof this //=> "object"
this === window //=> true
```

In a brand new Chrome console try the code above. All the code you write in a
JavaScript file can be thought of as "one big function" whose context is set to
the `Window` object. Thus `this === window` is `true`.

We can try the same thing out in NodeJS. If you have `node` installed on your
computer, open the Node REPL by typing `node`.

```js
this === global //=> true
```

Node calls the default _execution console_ `global`, but otherwise it's a
global object like `window`.

> **STICKY PROBLEM**: Keen-eyed readers might be thinking: "But is `this ===
> Window` also `true`?" It is not. The `window` property is part of the
> `Window` global object; the `Window` `Object` has a property that points
> to itself. Because the console's _execution context_ is `Window`, typing
> `window` is assumed to be "on" `Window`, so `window` gives you back `Window`.
> Due to the strictness of `===`, a property pointing to a thing is not the
> same thing as the thing itself. As such `this === Window` is `false`, but `this
> === window` is `true` _despite the fact_ that they both ultimately point to
> the same thing. If all this strikes you as a bit fussy and uninteresting, it's
> not essential understanding for the rest of this module. For more on this
> consult [Window.window][w1].

### Access Implicitly-Set Global Object in a Function Call

All functions declarations and function expressions you have called to this
point have also had an _execution context_, you just didn't notice it.

```js
let contextReturner = function() {
  return this
}

contextReturner() //=> window
```

When you invoked a function, the global context was _implicitly_ passed.  Why
the heck does it do that? It does it so that by default our functions can
access any properties on that most-global object, `window` (or `global` in
Node). Consider:

```js
let locationReturner = function() {
  return this.location.host
}

locationReturner() //=> URL host serving this page e.g. developer.mozilla.org
```

Doesn't that seem _nice_? Any function, by default, knows about the place where
it's running. Considering how often JavaScript is used for web-based and
URL-based logic, this is just _nice_ for programmers. Assuming the default
_execution context_ for function calls to be the global object is done for
programmer convenience (imagine that!).

> **NEUROLINGUISTIC/ANTHROPOLOGICAL ASIDE**: Some people think that `this` is a
> strange thing to call such an important concept. But pronouns like "this,"
> "he," or "here" all refer to a _context_. At a concert, if I say (scream)
> "It's noisy here," you don't think "In the Milky Way galaxy? I disagree.
> Space has little oxygen as a sound medium and is therefore quite quiet." You
> recognize the most relevant context is at this significant and unusual
> happening with giant speakers and guitar players and know that "here" refers
> to "this concert."

### Prevent Implicitly Setting in Function Calls With `use strict`

We wish we could say that the default context was **always** the global object.
It'd make things simple.

However, in JavaScript, if the engine sees the `String` "use strict" inside a
function, it will _stop_ making that implicit _execution context_ setting.
If it sees `"use strict"` at the top of a JavaScript code file, it will apply
this rule (and other strict behaviors) to _all functions_.

```js
function looseyGoosey() {
  return this
}

function noInferringAllowed() {
  "use strict"
  return this
}

looseyGoosey() === window; //=> true
noInferringAllowed() === undefined //=> true
```

There are really no rules as to which you'll see more. Some programmers think
`strict` stops confusing bugs (seems wise!); others think it's an obvious rule
of the language and squelching it is against the language's love of functions
(a decent argument!). Generally, we advise you to think of the "default mode"
as the one that permits an _implicit_ presumption of context. For more, see the
Resources.

### Access Implicitly-Set Parent Object in Contained Function Expression

This (no pun intended) is simple, thankfully: functions inside Objects have
`this` pointing to their container so that they can access other sibling
properties or functions:

```js
let byronPoodle = {
  name: "Byron",
  sonicAttack: "ear-rupturing atomic bark",
  mostHatedThing: "noises in the apartment hallway",
  warn: function() {
    console.log(`${this.name} issues an ${this.sonicAttack} when he hears ${this.mostHatedThing}`)
  }
}
byronPoodle.warn()
// LOG: Byron issues an ear-rupturing atomic bark when he hears noises in the apartment hallway
```

### Access Implicitly-Set New Object in Object-Oriented Programming Constructor

This lesson covers how `this` works, all in one place. An important place where
`this` is implicitly set is when new instances of classes are created. Class
definition and instance creation are hallmarks of object-oriented ("OO")
programming, a style you might not be familiar with. Rather than ignore this
important case until later, we're going to cover it now, even though you might
not be familiar with OO.

If you're not familiar with OO in JavaScript (or anywhere for that matter!),
that's OK, just file this rule away for later.  When you see `this` inside of a
class definition in JavaScript, come back and make sure you understand this
rule.

That said, this rule is a lot like the previous one, it's for convenience and
feels "natural" from a linguistic point of view: "The thing we're setting up
should be the default context for work during its construction in its own
`constructor` function; so, JavaScript make it so."

```js
class Poodle{
  constructor(name, pronoun){
    this.name = name;
    this.pronoun = pronoun
    this.sonicAttack = "ear-rupturing atomic bark"
    this.mostHatedThing = "noises in the apartment hallway"
  }

  warn() {
    console.log(`${this.name} issues an ${this.sonicAttack} when ${this.pronoun} hears ${this.mostHatedThing}`)
  }
}
let b = new Poodle("Byron", "he")
b.warn() //=> Byron issues an ear-rupturing atomic bark when he hears noises in the apartment hallway
```

To sum up the previous discussion:

1. ***Execution context is set at function call-time, implicilty or explicitly.*** 
2. ***Execution context defaults to the global object unless prevented by `"use strict"`.***
3. ***Execution context defaults to the containing `Object` for function expressions that are properties within that `Object`***
4. ***Execution context defaults to the new object in a `class`'s `constructor`***

So let's learn to _explicitly_ set the context of a function call.

## Explicitly Override Context with `call` and `apply`

The methods on functions called `call` and `apply` allow us to override the
_execution context_.

Let's think back to the previous lesson and recall working with records.

```js
let asgardianBrothers = [
  {
    firstName: "Thor",
    familyName: "Odinsson"
  },
  {
    firstName: "Loki",
    familyName: "Laufeysson-Odinsson"
  }
]

let intro = function(person, line) {
  return `${person.firstName} ${person.familyName} says: ${line}`
}

let introWithContext = function(line){
  return `${this.firstName} ${this.familyName} says: ${line}`
}

let phrase = "I like this brown drink very much, bring me another!"
intro(asgardianBrothers[0], phrase) //=> Thor Odinsson says: I like this brown drink very much, bring me another!
intro(asgardianBrothers[0], phrase) === introWithContext.call(asgardianBrothers[0], phrase) //=> true
intro(asgardianBrothers[0], phrase) === introWithContext.apply(asgardianBrothers[0], [phrase]) //=> true

let huffyPhrase = "I was falling for thirty minutes!"
intro(asgardianBrothers[1], huffyPhrase) === introWithContext.call(asgardianBrothers[1], huffyPhrase) //=> true
intro(asgardianBrothers[1], huffyPhrase) === introWithContext.apply(asgardianBrothers[1], [huffyPhrase]) //=> true
```

In the previous lesson, we wrote functions like `intro`. They took the record
as an argument. In fact, if we look at the `solution` for the previous lesson
we'll see that multiple functions have the same, first parameter: `employee`,
the record.

```js
let createTimeInEvent = function(employee, dateStamp){ }
let createTimeOutEvent = function(employee, dateStamp){ }
let hoursWorkedOnDate = function(employee, soughtDate){ }
```

What if we told JavaScript that instead of the record being parameter (in
addition to a catchphrase), it could be assumed as a _context_ and thus
accessible via `this`.

That's exactly what we do with `introWithContext`. The `introWithContext` has
no expected parameters (except for a catchphrase). Both `call` and `apply` have
take a `thisArg` argument as their first argument: that argument becomes the
`this` _inside_ the function. In the case of `call`, anything after the
`thisArg` gets passed to the function like arguments. In the case of `apply`,
the contents in the `Array` get destructured and passed to the function like
arguments.

> **ES6 ALERT**: Some might wonder, if we have destructuring of Arrays, why do
> we need both `call` _and_ `apply`. Destructuring is a relatively new arrival
> to JavaScript, so had two separate methods.

## Explicitly Lock Context For a Function With `bind`

Let's suppose that we wanted to create the `introWithContext` function, but
have it permanently bound to `asgardianBrothers[0]`. As the adjective "bound"
suggests, we use `bind`:

```js
thorIntros = introWithContext.bind(asgardianBrothers[0])
thorIntros("Hi, Jane") //=> Thor Odinsson says: Hi, Jane
thorIntros("I love snakes") //=> Thor Odinsson says: I love snakes
```

The `bind` method ***returns a function that needs to be called***, but
wherever the function that `bind` was called on had a `this` reference, it is
"hard set" to what was passed into `bind`.

To sum up the explicit overrides:

1. Execution context is set in a function by invoking `call` on the function
   and passing, as first argument, a `thisArg` which is accessed via `this` in
   the function. Additional parameters to the function are listed after `,`
2. Execution context is set in a function by invoking `apply` on the function
   and passing, as first argument, a `thisArg` which is accessed via `this` in
   the function. Additional parameters to the function are stored in the
   second argument: an `Array` containing arguments to the function.
3. Execution context can be locked in a function by invoking `bind` on it and
   passing it a `thisArg`. The `bind` function makes a copy of the
   functionality of its function but with all the `this` stuff hard coded and
   returns that function. That _new_ function can have arguments passed to it
   during its call with `()` as usual. 

## Lab

In this lab you will create functions to pass the same tests as in the previous
lab; however, the tests have changed to invoke the function using a record as
the execution context instead of passing the record as an argument. While the
code will stay mostly the same, you're going to need to use `this` a lot more.

## Conclusion

This is one of the hardest topics in JavaScript. But you have hands on
experience with the why and motivations of it! You're so much better off than
most JavaScript hackers who _never_ quite get the hang of it. It's been a lot
of growth, but this hard-won knowledge is going to help you do staggeringly
cool things. Here's a summary of execution context all in one place. Come back
whenever you need! We do!

1. Execution context is set at function call-time, implicilty or explicitly. 
2. Execution context defaults to the global object unless prevented by `"use strict"`.
3. Execution context defaults to the containing `Object` for function expressions that are properties within that `Object*
4. Execution context defaults to the new object in a `class`'s `constructor`***
1. Execution context is set in a function by invoking `call` on the function
   and passing, as first argument, a `thisArg` which is accessed via `this` in
   the function. Additional parameters to the function are listed after `,`
2. Execution context is set in a function by invoking `apply` on the function
   and passing, as first argument, a `thisArg` which is accessed via `this` in
   the function. Additional parameters to the function are stored in the
   second argument: an `Array` containing arguments to the function.
3. Execution context can be locked in a function by invoking `bind` on it and
   passing it a `thisArg`. The `bind` function makes a copy of the
   functionality of its function but with all the `this` stuff hard coded and
   returns that function. That _new_ function can have arguments passed to it
   during its call with `()` as usual. 

## Resources

* [Window][w1]
* [strict][]
* [`bind`][bind]
* [`call`][call]
* [`apply`][apply]

[w1]: https://developer.mozilla.org/en-US/docs/Web/API/Window/window
[bind]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
[call]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/call
[apply]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/apply
[strict]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
