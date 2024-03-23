<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\User\LoginRequest;
use App\Http\Requests\User\CreateUserRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\NotificationController;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::where('role', 'user')->get();
            return response()->json([
                'message' => 'OK',
                'data' => $users
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $validated = $request->validated();
            $user = User::where('email', $validated['email'])->first();
            if(Hash::check($validated['password'], $user->password)) {
                $user->last_active = now();
                $user->save();
                return response()->json([
                    'message' => 'OK',
                    'uid' => $user,
                    'role' => $user->role
                ], 200);
            }
            $errors = ['email' => 'invalid email or password'];

            return response()->json([
                'message' => 'unauthorized',
                'errors' => $errors
            ], 422);
            // if (!Auth::attempt($request->only('email', 'password'))) {
            //     return response([
            //         'message' => 'Invalid Response',
            //     ], Response::HTTP_UNAUTHORIZED);
            // }
        
            // $user = Auth::user();
        
            // $token = $user->createToken('token')->plainTextToken;
        
            // $cookie = cookie('jwt', $token, 60 * 24);
        
            // return response(['message' => 'Success', 'token' => $token])->withCookie($cookie);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e
            ], 500);
        }
    }

    public function store(CreateUserRequest $request)
    {
        try {
            $validated = $request->validated();
            $user = new User();
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->password = Hash::make($validated['password']);
            $user->default_password = $validated['password'];
            $user->role = 'user';
            $user->last_active = now();
            $user->save();
            return response()->json([
                'message' => 'User successfully created',
                'uid' => $user->id
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e
            ], 500);
        }
    }

    public function archive()
    {
        try {
            $trash = User::onlyTrashed()->get();
            return response()->json([
                'message' => 'OK',
                'data' => $trash
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function restore(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required',
                'user_id' => 'required|exists:users,id'
            ]);
            $result = User::withTrashed()->find($validated['id'])->restore();
            if(!$result) {
                return response()->json(['message'=>'failed to restore'], 401);
            } 
            NotificationController::write($validated['user_id'], 'You have restored a User from the Archive.');
            return response()->json(['message'=>'User restored successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function destroy(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:users,id',
                'user_id' => 'required|exists:users,id'
            ]);
            $result = User::find($validated['id'])->delete();
            if (!$result) {
                return response()->json(['message'=>'failed to delete'], 401);
            }
            NotificationController::write($validated['user_id'], 'You have deleted a User. You may now view it in the Archive.');
            return response()->json(['message'=>'User has been deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }
}
