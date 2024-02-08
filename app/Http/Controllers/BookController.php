<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::all();

        return view('books.index', compact('books'));

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        return view('books.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $request->validate([
            'title' => 'required|min:10|max:255',
            'author' => 'required|string',
            'genre' => 'required|string',

        ]);

        $book = Book::create($request->all());
        if ($request) {
            return response()->json(['status' => 'success', 'message' => 'Success! book is created', 'book' => $book]);
        }
        return response()->json(['status' => 'failed', 'message' => 'Failed! Unable to create book']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        return view('books.show', compact('book'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Book $book)
    {
        // return view('books.edit', compact('book'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {

        $request->validate([
            'title' => 'required|min:10|max:255',
            'author' => 'required|string',
            'genre' => 'required|string',

        ]);

        if ($book) {
            $book->save();
            return response()->json(['status' => 'success', 'message' => 'Success! book is created', 'book' => $book]);
        }
        return response()->json(['status' => 'failed', 'message' => 'Failed! Unable to create book']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book): JsonResponse
    {
        if ($book) {
            $book->delete();
            return response()->json(['status' => 'success', 'message' => 'Success! book is deleted', 'todo' => $book]);
        }
        return response()->json(['status' => 'success', 'message' => 'Failed! Unable to delete book']);
    }


}