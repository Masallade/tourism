@extends('admin.layouts.app')
@section('content')
    <h1>Edit Service Provider</h1>
    <form action="{{ route('admin.service-providers.update', $serviceProvider) }}" method="POST">
        @csrf
        @method('PUT')
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" name="name" class="form-control" value="{{ $serviceProvider->name }}" required>
        </div>
        <div class="form-group">
            <label for="country_id">Country</label>
            <select name="country_id" class="form-control" required>
                @foreach($countries as $country)
                    <option value="{{ $country->id }}" @if($serviceProvider->country_id == $country->id) selected @endif>{{ $country->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label for="service_type_id">Service Type</label>
            <select name="service_type_id" class="form-control" required>
                @foreach($serviceTypes as $type)
                    <option value="{{ $type->id }}" @if($serviceProvider->service_type_id == $type->id) selected @endif>{{ $type->name }}</option>
                @endforeach
            </select>
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <textarea name="description" class="form-control">{{ $serviceProvider->description }}</textarea>
        </div>
        <div class="form-group">
            <label for="price_range">Price Range</label>
            <input type="text" name="price_range" class="form-control" value="{{ $serviceProvider->price_range }}">
        </div>
        <div class="form-group">
            <label for="website">Website</label>
            <input type="url" name="website" class="form-control" value="{{ $serviceProvider->website }}">
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" name="email" class="form-control" value="{{ $serviceProvider->email }}">
        </div>
        <button type="submit" class="btn btn-success">Update</button>
    </form>
@endsection
