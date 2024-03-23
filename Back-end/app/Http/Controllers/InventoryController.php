<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inventory;
use App\Models\Order;
use App\Models\Sale;
use App\Http\Requests\Inventory\StoreRequest;
use App\Http\Requests\Inventory\UpdateRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NotificationController;

class InventoryController extends Controller
{
    public function index()
    {
        try {
            $stocks = Inventory::with('item')->get();
            return response()->json([
                'message' => 'OK',
                'data' => $stocks
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function store(StoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $stocks = new Inventory();
            $stocks->user_id = $validated['user_id'];
            $stocks->item_id = $validated['item_id'];
            $stocks->unit_price = $validated['unit_price'];
            $stocks->total_cost = $validated['cost'];
            $stocks->unit_cost = $validated['cost']/$validated['quantity'];
            $stocks->quantity = $validated['quantity'];
            $stocks->stock = $validated['quantity'];
            $stocks->expiry = $validated['expiry'];
            $stocks->save();
            return response()->json([
                'message' => 'Successfully added',
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:inventories,id'
            ]);
            $data = Inventory::find($validated['id']);
            return response()->json([
                'message' => 'OK',
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function update(UpdateRequest $request)
    {
        try {
            $validated = $request->validated();
            $stock = Inventory::find($validated['id']);
            $diff = $validated['quantity'] - $stock->quantity;
            $updatedStock = $stock->stock + $diff;
            if(Order::where('inventory_id', $validated['id'])->sum('quantity') > $validated['quantity']) {
                return response()->json(['message' => 'invalid quantity'], 401);
            }
            $stock->update([
                'total_cost' => $validated['total_cost'],
                'unit_cost' => $validated['total_cost']/$validated['quantity'],
                'quantity' => $validated['quantity'],
                'unit_price' => $validated['unit_price'],
                'expiry' => $validated['expiry'],
                'stock' => $updatedStock
            ]);
            return response()->json([
                'message' => 'Inventory successfully updated',
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function dashboard()
    {
        try {
            $thirtyDaysFromNow = Carbon::now()->addDays(30);
            $startOfWeek = Carbon::now()->startOfWeek();
            $endOfWeek = Carbon::now()->endOfWeek();
            $startOfMonth = Carbon::now()->startOfMonth();
            $endOfMonth = Carbon::now()->endOfMonth();
            $today = Carbon::now()->toDateString();
            $currentMonth = Carbon::now()->format('Y-m');
            $expired = Inventory::whereDate('expiry', '<=', $thirtyDaysFromNow)->where('stock', '>', 0)->with('item')->get();
            $todayProfit = Sale::whereDate('created_at', $today)->get();
            $weekProfit = Sale::whereBetween('created_at', [$startOfWeek, $endOfWeek])->get();
            $monthProfit = Sale::whereBetween('created_at', [$startOfMonth, $endOfMonth])->sum('total');
            $totalStock = Inventory::where('stock', '>', 0)->sum(DB::raw('stock * unit_price'));
            $year = Sale::whereYear('created_at', Carbon::now()->year)->sum('total');
            $stock = Inventory::where('stock', '>', 0)->whereDate('expiry', '>=', $thirtyDaysFromNow)->with('item')->get();
            return response()->json([
                'message' => 'OK',
                'expired' => $expired,
                'today' => $todayProfit->sum('total'),
                'week' => $weekProfit->sum('total'),
                'month' => $monthProfit,
                'year' => $year,
                'total' => $totalStock,
                'stock' => $stock
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function select()
    {
        try {
            $thirtyDaysFromNow = Carbon::now()->addDays(30);
            $data = Inventory::with('item')->whereDate('expiry', '>', $thirtyDaysFromNow)->get();
            return response()->json([
                'message' => 'OK',
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function archive()
    {
        try {
            $data = Inventory::onlyTrashed()->with('item')->get();
            return response()->json([
                'message' => 'OK',
                'data' => $data
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function delete(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:inventories,id',
                'user_id' => 'required|exists:users,id'
            ]);
            $result = Inventory::find($validated['id'])->delete();
            if (!$result) {
                return response()->json([
                    'message' => 'Failed to delete stock'
                ], 402);
            }
            NotificationController::write($validated, 'You have deleted an Inventory. You may now view it on Inventory Archive.');
            return response()->json(['message'=>'Inventory successfully deleted.'], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function restore(Request $request)
    {
        try {
            $validated = $request->validate([
                'id' => 'required|exists:inventories,id',
                'user_id' => 'required|exists:users,id'
            ]);
            $result = Inventory::withTrashed()->find($validated['id'])->restore();
            if (!$result) {
                return response()->json(['message'=>'Failed to restore.'], 402);
            }
            NotificationController::write($validated['user_id'], 'You have restored an archived Inventory.');
            return response()->json(['message' => 'Inventory successfully restored.'], 200);
        } catch (Exception $th) {
            return response()->json(['message'=>$th], 500);
        }
    }
}
