<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(UserController::class)->group(function() {
    Route::get('/user/index', 'index');
    Route::post('/user/login', 'login');
    Route::post('/user/register', 'store');
    Route::get('/user/archive', 'archive');
    Route::post('/user/delete', 'destroy');
    Route::post('/user/restore', 'restore');
});

Route::controller(ItemController::class)->group(function() {
    Route::get('/item', 'index');
    Route::post('/item/store', 'store');
    Route::post('/item/delete', 'delete');
    Route::get('/item/archive', 'archive');
    Route::post('/item/restore', 'restore');
    Route::post('/item/show', 'show');
    Route::post('/item/update', 'update');
});

Route::controller(InventoryController::class)->group(function() {
    Route::get('/inventory', 'index');
    Route::post('/inventory/store', 'store');
    Route::get('/inventory/dashboard', 'dashboard');
    Route::post('/inventory/delete', 'delete');
    Route::get('/inventory/archive', 'archive');
    Route::post('/inventory/restore', 'restore');
    Route::post('/inventory/show', 'show');
    Route::post('/inventory/update', 'update');
    Route::get('/inventory/select', 'select');
});

Route::controller(SaleController::class)->group(function() {
    Route::get('/sale', 'index');
    Route::get('/sale/dashboard', 'overview');
});

Route::controller(OrderController::class)->group(function() {
    Route::get('/order', 'index');
    Route::post('/order/barcode', 'show');
    Route::post('/order/store', 'store');
});

Route::controller(NotificationController::class)->group(function() {
    Route::post('/notifications', 'read');
    Route::post('/notification/read', 'update');
    Route::post('/notification/delete', 'delete');
});