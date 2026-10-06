<?php

namespace App\Filament\Concerns;

/**
 * After a successful create/save, return to the resource's list page instead
 * of staying on the form. Filament calls getRedirectUrl() only once the record
 * has been saved, so failed validation keeps the form open.
 */
trait RedirectsToResourceIndex
{
    protected function getRedirectUrl(): string
    {
        return static::redirectResource()::getUrl('index');
    }

    /**
     * The resource whose list to return to.
     */
    protected static function redirectResource(): string
    {
        return static::getResource();
    }
}
