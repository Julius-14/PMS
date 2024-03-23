<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Http\Requests\Item\StoreRequest;
use App\Http\Controllers\NotificationController;

class ItemController extends Controller
{
    public function index()
    {
        try {
            $items = Item::all();
            return response()->json([
                'message' => 'OK',
                'data' => $items
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:items,id'
            ]);
            $data = Item::find($validated['id']);
            return response()->json([
                'message' => 'OK',
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json(['messag'=>$e], 500);
        }
    }

    public function store(StoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $item = new Item();
            $item->item_name = $validated['item_name'];
            $item->barcode = $validated['barcode'];
            $item->unit = $validated['unit'];
            $item->save();
            NotificationController::write($request->user_id, 'You have created an Item.');
            return response()->json([
                'message' => 'Item successfully added'
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function update(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:items,id',
                'item_name' => 'required',
                'barcode' => 'required',
                'unit' => 'required'
            ]);
            $item = Item::find($validated['id']);
            $result = $item->update($validated);
            if (!$result) {
                return response()->json(['message'=>'Failed to update Item'], 402);
            }
            return response()->json([
                'message' => 'Item successfully updated'
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function delete(Request $request) 
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:items,id',
                'user_id' => 'required|exists:users,id'
            ]);
            $item = Item::find($validated['id']);
            $result = $item->delete();
            if (!$result) {
                return response()->json(['message' => 'Failed to delete Item.'], 402);
            }
            NotificationController::write($validated['user_id'], 'You have deleted an Item. You may view it in the Item Archive.');
            return response()->json([
                'message' => 'Item successfully deleted.'
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function archive()
    {
        try {
            $archive = Item::onlyTrashed()->get();
            return response()->json([
                'message' => 'OK',
                'data' => $archive
            ]);
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
            $result = Item::withTrashed()->find($validated['id'])->restore();
            if (!$result) {
                return response()->json(['message'=>'Failed to restore Item'], 402);
            }
            NotificationController::write($validated['user_id'], 'You have restored an Item from the Archive.');
            return response()->json([
                'message' => 'Item successfully restored'
            ]);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }
}
