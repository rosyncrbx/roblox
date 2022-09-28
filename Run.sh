#!/bin/bash
start(){
node . | true;
start;
};
start;
