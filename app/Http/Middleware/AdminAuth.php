<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required'
                ], 401);
            }
            
            return redirect('/admin/login');
        }

        $user = Auth::user();
        
        // Check if user has admin role
        if ($user->role !== 'admin') {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin access required'
                ], 403);
            }
            
            return redirect('/admin/login')->with('error', 'Admin access required');
        }

        return $next($request);
    }
}



