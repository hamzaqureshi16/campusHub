import bodyParser from "body-parser";
import cors from "cors";
import express, { response } from "express";
import admin from "firebase-admin";
import serviceAccount from "./firebaseservicekey.json" assert { type: "json" };
import { auth } from "./firebaseConfig.js";
import multer from "multer";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const restrictedWords = ["bc", "mc", "dog", "rat", "cat"];
const app = express();
app.listen(3000);

const storage = getStorage();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://campushub-4e727.firebaseio.com",
});

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Example Firebase usage
const db = admin.firestore();

app.route("/").get((req, res) => {
  res.send("Hello World!");
});

app.post("/stuLogin", (req, res) => {
  const { registration, password } = req.body;
  const collectionRef = db.collection("students");

  const snapshot = collectionRef
    .where("rg", "==", registration)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return;
      }

      res.send({
        message: "User found",
        email: snapshot.docs[0].data().email,
        status: 200,
      });
    });
});
// signup api for student
app.route("/studentsignup").post((req, res) => {
  const { email, password, name, department, rg, uid } = req.body;

  console.log({ email, password, name, department, rg, uid });

  const userRef = db.collection("students").doc(uid);
  const phone = "";

  userRef
    .set({
      email,
      name,
      department,
      rg,
      phone,
    })

    .then(() => {
      console.log("Document successfully written!");
      res.send({ message: "User created successfully", status: 200 });
    })

    .catch((error) => {
      console.error("Error writing document: ", error);
      res.send({ message: "Error creating user", status: 404 });
    });
});

app.route("/getgroups/:uid").get((req, res) => {
  const uid = req.params.uid;
  const userRef = db.collection("faculty").doc(uid);

  let users = [];

  //get the data of the user
  let data = {};

  userRef
    .get()

    .then((doc) => {
      if (doc.exists) {
        data = doc.data();
        users.push(data);
        const groupRef = db.collection("groups");
        let groups = [];

        users.map((user) => {
          groupRef
            .where("department", "==", user.department)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                groups.push(doc.data());
              });
              res.send(groups);
            })
            .catch((err) => {
              console.log("Error getting documents", err);
            });
        });
      } else {
        // doc.data() will be undefined in this case
        const sturef = db.collection("students").doc(uid);

        sturef
          .get()

          .then((doc) => {
            if (doc.exists) {
              data = doc.data();
              users.push(data);

              const groupRef = db.collection("groups");
              let groups = [];

              users.map((user) => {
                groupRef
                  .where("department", "==", user.department)
                  .get()
                  .then((snapshot) => {
                    snapshot.forEach((doc) => {
                      groups.push(doc.data());
                    });
                    res.send(groups);
                  })
                  .catch((err) => {
                    console.log("Error getting documents", err);
                  });
              });
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          });
      }
    });
});

const filter = (message) => {
  const restrictedWords = ["dog", "badword", "anotherbadword"]; // Add your restricted words here
  let censoredMessage = message;

  restrictedWords.forEach((word) => {
    const regexPattern = new RegExp(`\\b${word}\\b`, "gi");
    const asterisks = "*".repeat(word.length);
    censoredMessage = censoredMessage.replace(regexPattern, asterisks);
  });

  return censoredMessage;
};

//send message
app.route("/sendmessage").post((req, res) => {
  const { sender, receiver, message, file } = req.body;
  const id = Math.random().toString(36).substring(7);

  const censoredMessage = filter(message);

  //
  const userRef = db.collection("messages").doc(id);
  userRef
    .set(
      {
        message: censoredMessage,
        datetime: admin.firestore.FieldValue.serverTimestamp(),
        sender: sender,
        receiver: receiver,
      },
      { merge: true }
    )
    .then(() => {
      const userRef = db.collection("notifications").doc(id);
      let name = "";

      db.collection("faculty")
        .doc(sender)
        .get()
        .then((doc) => {
          if (doc.exists) {
            name = doc.data().name;
            console.log(name);
            userRef
              .set(
                {
                  message: `${name} sent you a message`,
                  datetime: admin.firestore.FieldValue.serverTimestamp(),
                  sender: sender,
                  receiver: receiver,
                },
                { merge: true }
              )
              .then(() => {
                console.log("Document successfully written!");
                return res.send({
                  message: "Message sent successfully",
                  status: 200,
                });
              })
              .catch((error) => {
                console.error("Error writing document: ", error);
                return res.send({
                  message: "Error sending message",
                  status: 404,
                });
              });
          } else {
            db.collection("students")
              .doc(sender)
              .get()
              .then((doc) => {
                if (doc.exists) {
                  name = doc.data().name;
                  console.log(name);
                  userRef
                    .set(
                      {
                        message: `${name} sent you a message`,
                        datetime: admin.firestore.FieldValue.serverTimestamp(),
                        sender: sender,
                        receiver: receiver,
                      },
                      { merge: true }
                    )
                    .then(() => {
                      console.log("Document successfully written!");
                      return res.send({
                        message: "Message sent successfully",
                        status: 200,
                      });
                    })
                    .catch((error) => {
                      console.error("Error writing document: ", error);
                      return res.send({
                        message: "Error sending message",
                        status: 404,
                      });
                    });
                } else {
                  // doc.data() will be undefined in this case
                  console.log("No such document! brosk");
                  return res.status(200).send({ message: "" });
                }
              })
              .catch((err) => {
                console.log("Error getting documents", err);
              });
          }
        });
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      res.send({ message: "Error sending message", status: 404 });
    });
});

//make a signup route
app.route("/facultysignup").post((req, res) => {
  const { uid, email, password, name, department } = req.body;
  console.log({ uid, email, password, name, department });

  const phone = "";
  const userRef = db.collection("faculty").doc(uid);
  userRef
    .set({
      email,
      name,
      department,
      phone,
    })
    .then(() => {
      console.log("Document successfully written!");
      res.send({ message: "User created successfully", status: 200 });
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      res.send({ message: "Error creating user", status: 404 });
    });
});

app.route("/allfaculty").get((req, res) => {
  const userRef = db.collection("users");
  userRef
    .get()
    .then((snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      res.send(users);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.route("/allusers").get((req, res) => {
  //findd all users in faculty and students collection
  const userRef = db.collection("faculty");
  const studRef = db.collection("students");
  let users = [];
  userRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let data = doc.data();
        data.uid = doc.id;
        data.role = "faculty";
        users.push(data);
      });
      studRef
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            let data = doc.data();
            data.uid = doc.id;
            data.role = "student";
            users.push(data);
          });
          console.log(users);
          res.send(users);
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.route("/sendgroupmessages").post((req, res) => {
  const { group, sender, message, senderName } = req.body;
  const id = Math.random().toString(36).substring(7);

  const censoredMessage = filter(message);

  //get name of user using sender wwhich is uid
  const userRef = db.collection("faculty").doc(sender);
  let name = "";
  userRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        name = doc.data().name;
        console.log(name);
        const userRef = db.collection("groupmessages").doc(id);
        userRef
          .set(
            {
              message: censoredMessage,
              datetime: admin.firestore.FieldValue.serverTimestamp(),
              sender: sender,
              group: group,
              senderName: name,
            },
            { merge: true }
          )
          .then(() => {
            //create notification
            const userRef = db.collection("notifications").doc(id);
            let senderRef = db.collection("faculty").doc(sender);
            let senderName = "";
            senderRef.get().then((doc) => {
              if (doc.exists) {
                senderName = doc.data().name;
                console.log(senderName);
                userRef
                  .set(
                    {
                      message: `${senderName} sent a message in ${group}`,
                      datetime: admin.firestore.FieldValue.serverTimestamp(),
                      sender: sender,
                      receiver: group,
                    },
                    { merge: true }
                  )
                  .then(() => {
                    console.log("Document successfully written!");
                    res.send({
                      message: "Message sent successfully",
                      status: 200,
                    });
                  })
                  .catch((error) => {
                    console.error("Error writing document: ", error);
                    res.send({
                      message: "Error sending message",
                      status: 404,
                    });
                  });
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            });
          });
      } else {
        const userRef = db.collection("students").doc(sender);
        let name = "";
        userRef
          .get()
          .then((doc) => {
            if (doc.exists) {
              name = doc.data().name;
              console.log(name);
              const userRef = db.collection("groupmessages").doc(id);
              userRef
                .set(
                  {
                    message: censoredMessage,
                    datetime: admin.firestore.FieldValue.serverTimestamp(),
                    sender: sender,
                    group: group,
                    senderName: name,
                  },
                  { merge: true }
                )
                .then(() => {
                  const groupRef = db.collection("groups");
                  let groupData = {};
                  //where id == group
                  groupRef
                    .where("id", "==", group)
                    .get()
                    .then((snapshot) => {
                      snapshot.forEach((doc) => {
                        groupData = doc.data();
                      });
                    });

                  const name = groupData.name;

                  console.log("Document successfully written!");
                  //create notification
                  const userRef = db.collection("notifications").doc(id);
                  userRef
                    .set(
                      {
                        message: `${name} sent a message in ${name}`,
                        datetime: admin.firestore.FieldValue.serverTimestamp(),
                        sender: sender,
                        receiver: group,
                      },
                      { merge: true }
                    )
                    .then(() => {
                      console.log("Document successfully written!");
                      res.send({
                        message: "Message sent successfully",
                        status: 200,
                      });
                    })
                    .catch((error) => {
                      console.error("Error writing document: ", error);
                      res.send({
                        message: "Error sending message",
                        status: 404,
                      });
                    });
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                  res.send({ message: "Error sending message", status: 404 });
                });
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
            }
          })
          .catch((err) => {
            console.log("Error getting documents", err);
          });
      }
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.route("/getgroupmessages").post((req, res) => {
  const { group } = req.body;
  const userRef = db.collection("groupmessages");
  let messages = [];
  userRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let dt = doc.data();
        if (dt.group == group) {
          messages.push(dt);
        }
      });
      res.send(messages);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
  console.log(messages);
});

app.route("/getmessages").post((req, res) => {
  const { sender, receiver } = req.body;
  const userRef = db.collection("messages");
  let messages = [];
  userRef
    .where("sender", "==", sender)
    .where("receiver", "==", receiver)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  userRef
    .where("sender", "==", receiver)
    .where("receiver", "==", sender)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      return res.send(messages);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.post("/addBlog", (req, res) => {
  const { title, content, author } = req.body;
  const id = Math.random().toString(36).substring(7);
  const userRef = db.collection("blogs").doc(id);

  userRef
    .set({
      title,
      content,
      author,
    })

    .then(() => {
      console.log("Document successfully written!");
      res
        .status(200)
        .send({ message: "Blog created successfully", status: 200 });
    })

    .catch((error) => {
      console.error("Error writing document: ", error);
      res.send({ message: "Error creating blog", status: 404 });
    });
});

app.get("/blogs", (_, res) => {
  const userRef = db.collection("blogs");
  let blogs = [];
  userRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).send(blogs);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.get("/notifications/:uid", (req, res) => {
  // const uid = req.params.uid;
  const notificationRef = db.collection("notifications");
  let notifications = [];

  //get all notifications
  notificationRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        notifications.push(doc.data());
      });
      console.log(notifications);
      return res.status(200).send(notifications);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.get("/getRole/:uid", (req, res) => {
  const uid = req.params.uid;
  const userRef = db.collection("faculty").doc(uid);
  let role = "student";
  userRef.get().then((doc) => {
    if (doc.exists) {
      role = "faculty";
      res.send({ role: role, status: 200 });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      res.send({ role: role, status: 200 });
    }
  });
});

app.post("/editProfile", (req, res) => {
  const { uid, email, password, phoneNumber } = req.body;
  console.log(req.body);
  let userRef = db.collection("students").doc(uid);

  if (userRef === null) {
    userRef = db.collection("faculty").doc(uid);
  }
  const updObj = {
    email: email,
    phone: phoneNumber,
  };

  userRef
    .update(updObj)

    .then(() => {
      console.log("Document successfully updated!");
      res.send({ message: "Profile updated successfully", status: 200 });
    })

    .catch((error) => {
      // The document probably doesn't exist.
      console.error("Error updating document: ", error);
      res.send({ message: "Error updating profile", status: 404 });
    });
});

app.post("/block", (req, res) => {
  const { blocker, blocked } = req.body;
  const id = Math.random().toString(36).substring(7);
  const userRef = db.collection("blocked").doc(id);

  userRef
    .set({
      blocker: blocker,
      blocked: blocked,
    })

    .then(() => {
      console.log("Document successfully written!");
      res.send({ message: "User blocked successfully", status: 200 });
    })

    .catch((error) => {
      console.error("Error writing document: ", error);
      res.send({ message: "Error blocking user", status: 404 });
    });
});

app.post("/unblock", (req, res) => {
  const { blocker, blocked } = req.body;

  const dbref = db.collection("blocked");
  dbref
    .where("blocker", "==", blocker)
    .where("blocked", "==", blocked)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
      return res.send({ message: "User unblocked successfully", status: 200 });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
      return res.send({ message: "erro", status: "400" });
    });

});

app.post("/getBlockedStatus", (req, res) => {
  const { blocker, blocked } = req.body;

  const dbref = db.collection("blocked");

  dbref
    .where("blocker", "==", blocker)
    .where("blocked", "==", blocked)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching documents.");
        return res.send({ message: false, status: 200 });
      } else {
        return res.send({ message: true, blocker: blocker, status: 200 });
      }
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.get("/getBlog/:id", (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  const userRef = db.collection("blogs").doc(id);
  let blog = {};

  userRef.get().then((doc) => {
    if (doc.exists) {
      blog = doc.data();
      return res.send({ blog: blog, status: 200 });
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return res.send({ blog: blog, status: 404 });
    }
  });
});

app.get("/getGroupParticipants/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  let department = "";
  const groupRef = db.collection("groups");
  let participants = [];
  groupRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.data().id == id) {
          console.log("found dept", doc.data().department);
          department = doc.data().department;
          const userRef = db.collection("faculty");
          userRef
            .where("department", "==", department)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                let data = doc.data();
                data = { ...data, uid: doc.id };
                participants.push(data);
              });
              return res.send({ participants: participants, status: 200 });
            });
        }
      });
    })
    .catch((err) => {
      res
        .status(404)
        .send({ message: "Error getting participants", status: 404 });
    });
});
