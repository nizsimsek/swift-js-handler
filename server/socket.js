import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 1337 });

const maxClients = 4;
let rooms = {};

wss.on("connection", (ws) => {
  ws.uuid = timeBasedUUID2();

  console.log("New connection", ws.uuid);

  ws.onmessage = (message) => {
    const data = JSON.parse(message.data);
    const { type, room } = data;

    switch (type) {
      case "join":
        if (!rooms[room]) {
          rooms[room] = [];
        }

        if (rooms[room].length < maxClients) {
          rooms[room].push(ws);

          rooms[room].forEach((client) => {
            if (client !== ws) {
              client.send(
                JSON.stringify({
                  type: "new_user_join",
                  success: true,
                  name: ws.uuid,
                  message: "Joined room",
                })
              );
            }
          });

          ws.send(
            JSON.stringify({
              type: "uuid",
              uuid: ws.uuid,
              message: "Joined room",
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              type: "join",
              success: false,
              name: "Server",
              message: "Room is full",
            })
          );
        }
        break;

      case "message":
        rooms[room].forEach((client) => {
          client.send(
            JSON.stringify({
              type: "message",
              name: ws.uuid,
              message: data.message,
            })
          );
        });
        break;
    }
  };

  ws.onclose = () => {
    Object.keys(rooms).forEach((room) => {
      rooms[room] = rooms[room].filter((client) => client !== ws);
    });

    rooms = Object.keys(rooms)
      .filter((room) => rooms[room].length > 0)
      .reduce((acc, room) => {
        acc[room] = rooms[room];
        return acc;
      }, {});

    Object.keys(rooms).forEach((room) => {
      rooms[room].forEach((client) => {
        client.send(
          JSON.stringify({
            type: "leave",
            name: "Server",
            message: `${ws.uuid} has left the room`,
          })
        );
      });
    });

    ws.close();
  };
});

/**
 * Generate time based UUID
 * This UUID is working with All Browsers
 * @returns {string} UUID
 */
/*
const timeBasedUUID = () => {
  // Get now time
  const n = Date.now();
  // Generate random
  const r = Math.random();
  // Stringify now time and generate additional random number
  const s = String(n) + String(~~(r * 9e4) + 1e4);
  // Form UUID and return it
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-4${s.slice(12, 15)}-${
    [8, 9, "a", "b"][~~(r * 3)]
  }${s.slice(15, 18)}-${s.slice(s.length - 12)}`;
};
*/

const timeBasedUUID2 = () => {
  // Get now time
  const n = Date.now();
  // Generate random
  const r = Math.random();
  // Stringify now time and generate additional random number
  const s = String(n) + String(~~(r * 9e4) + 1e4);
  // Form UUID and return it
  return `${s.slice(8, 12)}-4${s.slice(12, 15)}`;
};
