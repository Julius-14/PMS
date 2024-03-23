<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Order\StoreRequest;
use App\Models\Order;
use App\Models\Sale;
use App\Models\Item;
use App\Models\Inventory;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index()
    {
        try {
            $orders = Order::with(['sales', 'stocks'])->get();
            return response()->json([
                'message' => 'OK',
                'data' => $orders
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function barcode(Request $request)
    {
        try {
            $validated = $request->validate([
                'barcode' => 'required',
                'quantity' => 'required'
            ]);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function show(Request $request)
    {
        try {
            $validated = $request->validate([
                'barcode' => 'required',
                'quantity' => 'required'
            ]);
            $thirtyDays = Carbon::now()->addDays(30);
            $item = Item::join('inventories', 'inventories.item_id', '=', 'items.id')
            ->selectRaw('
                items.item_name,
                items.barcode,
                inventories.unit_price,
                1 as quantity,
                inventories.stock
            ')
            ->whereDate('inventories.expiry', '>', $thirtyDays)
            ->where('inventories.stock', '>', 0)
            ->where('items.barcode', $validated['barcode'])->first();
            if(!$item) {
                return response()->json(['message'=>'Item not found'], 422);
            }
            $stock = Inventory::join('items', 'items.id', '=', 'inventories.item_id')
            ->where('items.barcode', $validated['barcode'])
            ->where('inventories.stock', '>', $validated['quantity'])
            ->doesntExist();
            if($stock) {
                return response()->json(['message' => 'quantity has exceeded the amount of available stocks'], 401);
            }
            return response()->json([
                'message' => 'Item found',
                'data' => $item
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function store(StoreRequest $request)
    {
        try {
            $validated = $request->validated();
            $sale = new Sale();
            $sale->user_id = $validated['user_id'];
            $sale->or_number = $validated['ro_num'];
            $sale->total = $validated['total'];
            $sale->save();
            foreach($validated['barcode'] as $key => $item) {
                $stock = Inventory::whereHas('item', function($query) use($item) {
                    $query->where('barcode', $item);
                })->first();
                $orders = new Order();
                $orders->sale_id = $sale->id;
                $orders->inventory_id = $stock->id;
                $orders->quantity = $validated['quantity'][$key];
                $orders->save();
                $updatedStock = $stock->stock - $validated['quantity'][$key];
                $stock->update([
                    'stock' => $updatedStock
                ]);
            }
            return response()->json([
                'message' => 'Transaction success',
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }
}
