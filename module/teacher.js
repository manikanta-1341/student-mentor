const { ObjectId } = require("mongodb");
const mongo = require("../shared/connect");

module.exports.getMentors = async (req, res, next) => {
  try {
    console.log("in get mentors");
    var data = await mongo.db.collection("mentor").find().toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
module.exports.getMentor = async (req, res, next) => {
  try {
    console.log("in get mentor");
    var data = await mongo.db
      .collection("mentor")
      .find({ _id: ObjectId(req.params.id)})
      .toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.createMentor = async (req, res, next) => {
  try {
    console.log("in create mentor");

    var data = await mongo.db.collection("mentor").insertOne(req.body);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.updateMentor = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("mentor")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: { ...req.body } });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.deleteMentor = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("mentor")
      .remove({ _id: ObjectId(req.params.id) });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.MentorWithoutStudents = async (req, res, next) => {
  console.log("in mwos");
  try {
    var mentor_data = await mongo.db.collection("mentor").find().toArray();
    var data = [];
    mentor_data.map((e) => {
      if (e.students) {
        console.log(e);
        mentor_data.splice(mentor_data.indexOf(e), 0);
      } else {
        data.push(e);
        console.log("data::", data);
      }
    });
    console.log("data::", data);
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.assignStudent = async (req, res, next) => {
  try {
    var student_data = await mongo.db.collection("student").find().toArray();
    var sorted_students = [];
    let variablesFound = false;
    student_data.map((e) => {
      if (e.mentor) {
        student_data.splice(student_data.indexOf(e), 0);
      } else {
        sorted_students.push({ name: e.name, id: e._id });
      }
    });

    if (req.body.students) {
      console.log("data::", sorted_students, req.body.students);
      let idsfrombody = req.body.students.map((e) => {
        return e.id;
      });
      let idsfromsorted_students = req.body.students.map((e) => {
        return e.id;
      });
      for (var i = 0; i < idsfrombody.length; i++) {
        if (idsfromsorted_students.includes(idsfrombody[i])) {
          variablesFound = true;
        } else {
          res.send("one of the given students already assigned");
        }
      }
      console.log(variablesFound);
      if (variablesFound && req.body.students.length == !null) {
        let response = req.body.students.map(async (e) => {
          let mentor_details = await mongo.db
            .collection("mentor")
            .find({ _id: ObjectId(req.params.id) })
            .toArray();
            console.log(
              "mentor data::",
              mentor_details,
              mentor_details[0].students[0]._id
              // mentor_details[0]._id
            );
          if (mentor_details[0].students[0]._id != e._id) {
            var data = await mongo.db
              .collection("mentor")
              .updateOne(
                { _id: ObjectId(req.params.id) },
                { $push: { students: e } }
              );
          }

          //req.body.students.map(async (e) => {
          console.log(typeof req.params.id);
          
          console.log("e", e);
          await mongo.db.collection("student").updateOne(
            { _id: ObjectId(e._id) },
            {
              $set: {
                mentor: [
                  {
                    _id: mentor_details[0]._id,
                    name: mentor_details[0].name,
                  },
                ],
              },
            }
          );
          return data;
        });
        res.send(response);
      } else {
        res.send("value format should be in object");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
