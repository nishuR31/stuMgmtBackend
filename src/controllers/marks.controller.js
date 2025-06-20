import Student from "../models/student.model.js";
import ApiErrorResponse from "../utils/ApiErrorResponse.js";
import ApiResponse from "../utils/ApiResponse.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import Marks from "../models/marks.model.js";

export let stuMarks = AsyncHandler(async (req, res) => {
  let data = req.body;
  let user = req.params.username;

  let { username, marks, subject, semester } = data;
  if (
    [username, subject, user].some(
      (field) => !field?.trim() || !marks || !semester
    )
  ) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Missing fields" }).res());
  }

  if (user !== username) {
    return res
      .status(400)
      .json(
        ApiErrorResponse({ message: "student usernames dont match" }).res()
      );
  }

  let marksModel = await Marks.findOne({ username });
  if (marksModel) {
    return res
      .status(409)
      .json(ApiErrorResponse({ message: "Marks already exists" }, 409).res());
  }

  let newMarks = await Marks.create({ ...data });
  if (!newMarks) {
    return res
      .status(500)
      .json(ApiErrorResponse({ message: "Marks creation failed" }, 500).res());
  }

  let student = await Student.findOne({ username });
  if (!student) {
    return res
      .status(404)
      .json(ApiErrorResponse({ message: "student dont exist" }, 404).res());
  }

  student.marks.push(newMarks._id);
  await student.save();

  return res
    .status(202)
    .json(ApiResponse({ message: "student marks added" }).res());
});

export let stuMarksEdit = AsyncHandler(async (req, res) => {
  let data = req.body;
  let user = req.params.username;
  let edit = req.params.edit;

  let { username, marks, subject, semester } = data;
  if (
    [username, edit, subject, user].some(
      (field) => !field?.trim() || !marks || !semester
    )
  ) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Missing fields" }).res());
  }

  if (edit.toLowerCase() !== "edit") {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Invalid edit query" }).res());
  }
  if (user !== username) {
    return res
      .status(400)
      .json(
        ApiErrorResponse({ message: "student usernames dont match" }).res()
      );
  }

  let marksModel = await Marks.findOneAndUpdate(
    { username },
    { ...data },
    { new: true, validateBeforeSave: false }
  );
  if (!marksModel) {
    return res
      .status(400)
      .json(ApiErrorResponse({ message: "Marks updatation failed" }).res());
  }

  let student = await Student.findOne({ username });
  if (!student) {
    return res
      .status(404)
      .json(ApiErrorResponse({ message: "student dont exist" }, 404).res());
  }

  student.marks.push(marksModel._id);
  await student.save();

  return res.status(202).json(
    ApiResponse({
      message: "both student marks and marsk updated too".toCapitalize(),
    }).res()
  );
});
