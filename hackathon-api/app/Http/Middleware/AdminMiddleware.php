<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check() && Auth::user()->role === 'admin') {
            return $next($request);
        }
        
        return response()->json([
            'success' => false,
            'error' => 'Доступ запрещен',
            'message' => 'Только администраторы имеют доступ к этому разделу'
        ], 403);
    }
}