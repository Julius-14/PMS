<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function read(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required'
            ]);
            $notifications = Notification::where('user_id', $validated['user_id'])->orderBy('created_at', 'desc')->get();
            return response()->json([
                'message' => 'OK',
                'data' => $notifications
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public static function write($id, $message)
    {
        $notification = new Notification();
        $notification->user_id = $id;
        $notification->message = $message;
        $notification->save();
    }

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id'
            ]);
            $result = Notification::where('user_id', $validated['user_id'])->update(['status' => 'read']);
            if (!$result) {
                return response()->json(['message' => 'Failed'], 402);
            }
            return response()->json(['message'=>'OK'], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:notifications,id',
                'user_id' => 'required|exists:users,id'
            ]);
            Notification::find($validated['id'])->delete();
            $notif = Notification::where('user_id', $validated['user_id'])->get();
            return response()->json([
                'message' => 'OK',
                'data' => $notif
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }
}
