
const express = require("express");
const router = express.Router();

const { authRequired } = require("../../middleware/auth");
const requireOneOf = require("../../middleware/requireOneOf");
const { validate } = require("../../utils/fv");

const sessionsCtrl = require("../../controllers/Feature 1.2/consultSessionsController");
const messagesCtrl = require("../../controllers/Feature 1.2/consultMessagesController");
const typingCtrl = require("../../controllers/Feature 1.2/consultTypingController");
const filesCtrl = require("../../controllers/Feature 1.2/filesController");

const {
  startSessionAudioSchema,
  startSessionAsyncSchema,
  updateBandwidthSchema,
  postMessageSchema,
  listMessagesQuerySchema,
  unreadMessagesQuerySchema,
  streamMessagesQuerySchema,
  fileUploadSchema,
  typingStatusSchema,
} = require("../../validators/consultSchemas");


router.post(
  "/sessions/audio",
  authRequired,
  validate({ schema: startSessionAudioSchema, source: "body" }),
  sessionsCtrl.startAudioSession
);

router.post(
  "/sessions/async",
  authRequired,
  validate({ schema: startSessionAsyncSchema, source: "body" }),
  sessionsCtrl.startAsyncSession
);


router.patch(
  "/sessions/:id/bandwidth",
  authRequired,
  validate({ schema: updateBandwidthSchema, source: "body" }),
  sessionsCtrl.updateBandwidthMode
);


router.post(
  "/sessions/:id/end",
  authRequired,
  sessionsCtrl.endSession
);

router.post(
  "/sessions/:id/messages",
  authRequired,
  validate({ schema: postMessageSchema, source: "body" }),
  requireOneOf(["body", "file_id"]),
  messagesCtrl.postMessage
);

router.get(
  "/sessions/:id/messages",
  authRequired,
  validate({ schema: listMessagesQuerySchema, source: "query" }),
  messagesCtrl.listMessages
);


router.get(
  "/sessions/:id/messages/unread",
  authRequired,
  validate({ schema: unreadMessagesQuerySchema, source: "query" }),
  messagesCtrl.listUnreadMessages
);


router.get(
  "/sessions/:id/messages/stream",
  authRequired,
  validate({ schema: streamMessagesQuerySchema, source: "query" }),
  messagesCtrl.streamMessages
);


router.post(
  "/files",
  authRequired,
  validate({ schema: fileUploadSchema, source: "body" }),
  filesCtrl.uploadFileMeta
);

router.get(
  "/files/:id",
  authRequired,
  filesCtrl.getFileMeta
);



router.post(
  "/sessions/:id/typing",
  authRequired,
  validate({ schema: typingStatusSchema, source: "body" }),
  typingCtrl.setTypingStatus
);


router.get(
  "/sessions/:id/typing",
  authRequired,
  typingCtrl.getTypingStatus
);

module.exports = router;
