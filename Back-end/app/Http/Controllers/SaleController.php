<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Inventory;
use Carbon\Carbon;

class SaleController extends Controller
{
    public function index()
    {
        try {
            $sales = Sale::with('orders.stocks.item')->orderBy('created_at', 'desc')->get();
            return response()->json([
                'message' => 'OK',
                'data' => $sales
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }

    public function overview()
    {
        try {
            $data = Sale::whereYear('created_at', Carbon::now()->year)->get();
            $cost = Inventory::whereYear('created_at', Carbon::now()->year)->get();
            return response()->json([
                'message' => 'OK',
                'data' => $data,
                'cost' => $cost
            ], 200);
        } catch (Exception $e) {
            return response()->json(['message'=>$e], 500);
        }
    }
}
