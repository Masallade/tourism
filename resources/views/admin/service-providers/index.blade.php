@extends('admin.layouts.app')
@section('content')
    <h1>Service Providers</h1>
    <a href="{{ route('admin.service-providers.create') }}" class="btn btn-primary">Add Service Provider</a>
    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif
    <table class="table">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Country</th>
                <th>Service Type</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach($serviceProviders as $provider)
                <tr>
                    <td>{{ $provider->id }}</td>
                    <td>{{ $provider->name }}</td>
                    <td>{{ $provider->country->name ?? '-' }}</td>
                    <td>{{ $provider->serviceType->name ?? '-' }}</td>
                    <td>{{ $provider->email }}</td>
                    <td>
                        <a href="{{ route('admin.service-providers.edit', $provider) }}" class="btn btn-sm btn-warning">Edit</a>
                        <form action="{{ route('admin.service-providers.destroy', $provider) }}" method="POST" style="display:inline-block;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
@endsection
