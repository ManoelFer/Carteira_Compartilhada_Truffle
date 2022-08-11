"use strict";
const chai = require("chai");

const chaiAsPromised = require("chai-as-promised");
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);
chai.use(chaiAsPromised);

module.exports = chai;