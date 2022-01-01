import { emitNotifyToArray, removeSocketIdFromArray, pushSocketIdToArray } from '../../helpers/socketHelpser';

let removeRequestContactSent = (io) => { //param 'io' from socket.io library
    let clients = {};
    io.on("connection", (socket) => {
        //push socket id to array
        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("remove-request-contact-sent", (data) => {
            let currentUser = {
                id: socket.request.user._id
            };

            //emit notification
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-remove-request-contact-sent", currentUser)
            };
        });
        socket.on("disconnect", () => {
            //remove socketId when socket disconnect
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        })
        // console.log(clients);
    })

}

module.exports = removeRequestContactSent;