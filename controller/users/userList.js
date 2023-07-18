const mysql = require("../mysql");
// const Pusher = require("pusher");
// const pusher = new Pusher({
//   appId: "1636801",
//   key: "44ff09de68fa52623d22",
//   secret: "2c11e7f6d816dcf20694",
//   cluster: "sa1",
//   useTLS: true
// });


const userList = async (req, res, next) => {

    try {

        const result = await mysql.execute("SELECT * FROM users");
        {
            const users = result.map((user) => {
                return {
                    id: user.id,
                    name: user.name
                   
                };
            });
            // pusher.trigger("my-channel", "my-event", {
            //     message:users
            //   });
            return res.status(200).send({
                 users:users
            });



        }
    } catch (error) {
        res.status(500).send({
            error: error,
        });
    }
}
module.exports = userList;