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

//send message
app.route("/sendmessage").post((req, res) => {
  const { sender, receiver, message, file } = req.body;
  const id = Math.random().toString(36).substring(7);

  if (restrictedWords.some((word) => message.includes(word))) {
    return res.send({
      message: "Message contains restricted words",
      status: 404,
    });
  }

  console.log(file);

  //
  const userRef = db.collection("messages").doc(id);
  userRef
    .set(
      {
        message: message,
        datetime: admin.firestore.FieldValue.serverTimestamp(),
        sender: sender,
        receiver: receiver,
      },
      { merge: true }
    )
    .then(() => {
      console.log("Document successfully written!");
      const userRef = db.collection("notifications").doc(id);
      let name = "";
      let senderRef = db.collection("faculty").doc(sender);
      if (senderRef == null) {
        senderRef = db.collection("students").doc(sender);
      }

      senderRef.get().then((doc) => {
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
              res.send({ message: "Message sent successfully", status: 200 });
            })
            .catch((error) => {
              console.error("Error writing document: ", error);
              res.send({ message: "Error sending message", status: 404 });
            });
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
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

  if (restrictedWords.some((word) => message.includes(word))) {
    return res.send({
      message: "Message contains restricted words",
      status: 404,
    });
  }

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
              message: message,
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
                    message: message,
                    datetime: admin.firestore.FieldValue.serverTimestamp(),
                    sender: sender,
                    group: group,
                    senderName: name,
                  },
                  { merge: true }
                )
                .then(() => {
                  console.log("Document successfully written!");
                  //create notification
                  const userRef = db.collection("notifications").doc(id);
                  userRef
                    .set(
                      {
                        message: `${name} sent a message in ${group}`,
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
  console.log(req.body);
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
      res.send(messages);
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

app.get("/blogs", (req, res) => {
  const userRef = db.collection("blogs");
  let blogs = [];
  userRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        blogs.push(doc.data());
      });
      res.status(200).send(blogs);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
});

app.get("/notifications/:uid", (req, res) => {
  const uid = req.params.uid;
  const userRef = db.collection("notifications");
  let notifications = [];
  userRef
    .where("sender", "==", uid)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        notifications.push(doc.data());
      });
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });

  //get users dept
  let userRef2 = db.collection("faculty").doc(uid);
  if (userRef2 == null) {
    userRef2 = db.collection("students").doc(uid);
  }

  let dept = "";
  userRef2
    .get()
    .then((doc) => {
      if (doc.exists) {
        dept = doc.data().department;
        console.log(dept);
        userRef
          .where("receiver", "==", dept)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              notifications.push(doc.data());
            });
          })
          .catch((err) => {
            console.log("Error getting documents", err);
          });
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
  console.log(notifications);
  res.send(notifications);
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
  const { sender, receiver } = req.body;

  const dbref = db.collection("blocked");

  dbref.find({ sender: sender, receiver: receiver }).toArray((err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.send({ message: "Already blocked", status: 404 });
    } else {
      dbref.insertOne({ sender: sender, receiver: receiver }, (err, result) => {
        if (err) throw err;
        return res.send({ message: "Blocked successfully", status: 200 });
      });
    }
  });
});

app.post('/getBlockedStatus',(req,res)=>{
  const {sender,receiver} = req.body;

  const dbref = db.collection('blocked');

  dbref.find({sender:sender,receiver:receiver}).toArray((err,result)=>{
    if(err) throw err;
    if(result.length>0){
      return res.send({message:true,status:200});
    }else{
      return res.send({message:false,status:404});
    }
  })  
})
