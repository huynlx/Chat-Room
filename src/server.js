// var express = require('express');
import express from 'express';
import ConnectDB from './config/ConnectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/api';
import connectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import events from "events";
import * as configApp from "./config/app";

import configSocketIo from './config/socketio';
import cookieParser from 'cookie-parser';

//Init app
let app = express();

//set max connection event listener
events.EventEmitter.defaultMaxListeners = configApp.app.max_event_listeners;

//Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

//Set .env
require('dotenv').config();

//Connect to MongoDB
ConnectDB();

//Config session
session.config(app);

//Config view engine
configViewEngine(app);

//Enable post data for request
app.use(express.urlencoded({ extended: false }));

//Enable flash messages
app.use(connectFlash());

//User Cookie Parser
app.use(cookieParser());

//Config passport js
app.use(passport.initialize());
app.use(passport.session());

//Init all routes api
initRoutes(app);

//Init all socket
initSockets(io);

//Config socketio
configSocketIo(io, cookieParser, session.sessionStore); //đăng nhập thì thêm vào client socketId

server.listen(process.env.PORT, process.env.HOSTNAME, () => { //run server
    console.log(`Hello Huynh, I am running http://${process.env.HOSTNAME}:${process.env.PORT}/`);
});