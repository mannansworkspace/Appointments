import React from 'react'

const PageNotFound = () => {
    return (
        <div class="bg-white">
            <div class="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
                <div class="bg-white overflow-hidden sm:rounded-lg pb-8">
                    <div class="text-center pt-8">
                        <h1 class="text-9xl font-bold text-blue-700">404</h1>
                        <h1 class="text-6xl font-medium py-8">oops! Page not found</h1>
                        <p class="text-2xl pb-8 px-12 font-medium">Oops! The page you are looking for does not exist.</p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PageNotFound;