"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const Compositition_1 = __importDefault(require("./Compositition"));
dotenv_1.default.config();
Compositition_1.default.configure();
const PORT = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/user', Compositition_1.default.authRouter());
app.use('/person', Compositition_1.default.getAllUserRouter());
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
