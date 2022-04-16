const { ObjectId } = require("mongodb");
const mongo = require("../shared/connect");

module.exports.getStudents = async (req, res, next) => {
  try {
    console.log("in get student");
    var data = await mongo.db.collection("student").find().toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
module.exports.getStudent = async (req, res, next) => {
  try {
    console.log("in get student");
    var data = await mongo.db
      .collection("student")
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.createStudent = async (req, res, next) => {
  try {
    console.log("in create student");

    var data = await mongo.db.collection("student").insertOne(req.body);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.updateStudent = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("student")
      .updateOne({ _id: ObjectId(req.params.id) }, { $set: { ...req.body } });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.deleteStudent = async (req, res, next) => {
  try {
    var data = await mongo.db
      .collection("student")
      .remove({ _id: ObjectId(req.params.id) });
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.withoutMentor = async (req, res, next) => {
  console.log("in SWOM");
  try {
    var student_data = await mongo.db.collection("student").find().toArray();
    console.log(student_data);

    var data = [];
    student_data.map((e) => {
      if (e.mentor) {
        console.log(e);
        student_data.splice(student_data.indexOf(e), 0);
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

module.exports.assignMentor = async (req, res, next) => {
  console.log("in assign mentor");
  try {
    var student_details = await mongo.db
      .collection("student")
      .find({ _id: ObjectId(req.params.id) })
      .toArray();
    console.log(student_details)
    if (req.body.mentor && typeof req.body.mentor === "object") {
      console.log("req.body", req.body);
      var student_data = await mongo.db
        .collection("student")
        .updateOne(
          { _id: ObjectId(req.params.id) },
          { $set: { mentor: [{ ...req.body.mentor }] } }
        );
      let mentor_details = await mongo.db
        .collection("mentor")
        .find({ _id: ObjectId(req.body.mentor._id) })
        .toArray();
      console.log(mentor_details,new ObjectId(req.body.mentor._id));
      // let student_existence = await mongo.db
      //   .collection("mentor")
      //   .find({ _id: ObjectId(req.body.mentor._id),"students":{"$exists":true} }).toArray()
      if (mentor_details[0].students) {
        console.log("boolean::", mentor_details[0].students);
        if (mentor_details[0].students[0].name != student_details[0].name) {
          console.log("after student insertion", mentor_details);
          await mongo.db.collection("mentor").updateOne(
            { _id: ObjectId(req.body.mentor[0]._id) },
            {
              $push: {
                students: {
                  name: student_details[0].name,
                  _id: ObjectId(student_details[0]._id),
                },
              },
            }
          );
        }
      } else {
        console.log("in else creating", req.params.id, req.body.mentor._id);
        await mongo.db.collection("mentor").updateOne(
          { _id: ObjectId(req.body.mentor._id) },
          {
            $set: {
              students: [
                {
                  name: student_details[0].name,
                  _id: ObjectId(student_details[0]._id),
                },
              ],
            },
          }
        );
      }
      console.log("before x");
      let mentorsWithSameStudents = await mongo.db
        .collection("mentor")
        .find({ students: { $elemMatch: { name: student_details[0].name } } })
        .toArray();
      console.log("mentorsWithSameStudents::", x);
      mentorsWithSameStudents.map(async (e) => {
        if (e._id.toString() != req.body.mentor._id) {
          console.log(
            "x in::",
            req.body.mentor._id,
            e._id,
            student_details[0]._id
          );
          await mongo.db.collection("mentor").updateOne(
            { _id: ObjectId(e._id) },
            {
              $pull: { students: { _id: ObjectId(student_details[0]._id) } },
            },
            false,
            true
          );
          //  let studentlength = await mongo.db
          //  .collection("mentor")
          //  .upd(
          //    { _id: ObjectId(e._id) })
        }
      });
      res.send(student_data);
    } else {
      res.send("value must in object format (or) key name should be mentor");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};
