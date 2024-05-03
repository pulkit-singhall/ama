import dbConnect from "@/db/db";
import { NextRequest } from "next/server";
import ApiResponse from "@/types/apiResponse";
import { MessageInterface, User, messageSchema } from "@/model/user.model";
import { messageContentSchema } from "@/schema/message.schema";
import { ClientSession } from "mongodb";
import { Document, Model, Types, DocumentSetOptions, QueryOptions, UpdateQuery, AnyObject, PopulateOptions, MergeType, Query, SaveOptions, ToObjectOptions, FlattenMaps, Require_id, UpdateWithAggregationPipeline, pathsToSkip, Error } from "mongoose";

export async function POST(req: NextRequest) {
    dbConnect
        .then((connection) => {})
        .catch((error) => {
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    "database not connected",
                    {}
                )
            )
        })
    
    try {
        const { content, username } = await req.json()
        messageContentSchema.parse(
            {
                content,
                username
            }
        )
        const user = await User.findOne({ username })
        if (!user) {
            return Response.json(
                new ApiResponse(
                    412,
                    false,
                    "user not found or wrong username",
                    {}
                )
            )
        }
        const status = user.isAcceptingMessages
        if (!status) {
            return Response.json(
                new ApiResponse(
                    400,
                    false,
                    "user is not accepting messages right now",
                    {}
                )
            )
        }
        const message: MessageInterface = {
            content : content.trim(),
            createdAt: new Date().toJSON()
        }
        user.messages.push(message)
        const save = await user.save(
            {
                validateBeforeSave: false
            }
        )
        if (!save) {
            return Response.json(
                new ApiResponse(
                    500,
                    false,
                    "internal server error",
                    {},
                )
            )
        }
        return Response.json(
            new ApiResponse(
                200,
                true,
                "message sent",
                {},
            )
        )
    } catch (error) {
        return Response.json(
            new ApiResponse(
                412,
                false,
                "message not sent",
                {},
                error
            )
        )
    }
}