# callback-manager-ts

This is the library for managing and grouping response from callback.
~~~
1. Synchronous mode ( all callable execute in the same time, and you got ane results )
2. Asynchronous mode ( callable execute one after one, and you got one results )
3. Asynchronous with break on error ( callable execute one after one, and stop if catch error )
~~~

# Usage
[Documentation](http://callbackmanagerts.pascalsystem.pl/)

In the very near future, please be patient.

# Tests
Module has simple tests

# TypeScript
This module writen in TypeScript

If you use TypeScript you must put this line with correct path in your script.
```code
/// <reference path='./node_modules/callback-manager-ts/callback-manager-ts.d.ts' /> 
```

# Installation
```bash
npm i callback-manager-ts
```

# Generate library documentation
```bash
npm run-script generate-docs
```
#Future
~~~
1. Fix docblock in current files and generate correctly library documentation
~~~