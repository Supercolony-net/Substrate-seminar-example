pub use crate::traits::wrapped_usd::*;
pub use brush::contracts::psp22::*;
use brush::{
    declare_storage_trait,
    traits::{
        AccountId,
        Balance,
    },
};
use ink_prelude::vec::Vec;

use ink_storage::traits::SpreadLayout;

#[cfg(feature = "std")]
use ink_storage::traits::StorageLayout;

#[derive(Default, Debug, SpreadLayout)]
#[cfg_attr(feature = "std", derive(StorageLayout))]
pub struct WrappedPSP22Data {
    pub wrapped_account: AccountId,
}

declare_storage_trait!(WrappedPSP22Storage, WrappedPSP22Data);

impl<T: PSP22 + WrappedPSP22Storage + PSP22Internal> WrappedPSP22 for T {
    /// Allow a user to deposit `amount` of underlying tokens and mint `amount` of the wrapped tokens to `account`
    fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
        self.wrapped()
            .transfer_from(Self::env().caller(), Self::env().account_id(), amount, Vec::<u8>::new())?;
        self._mint(account, amount)
    }

    /// Allow a user to burn `amount` of wrapped tokens and withdraw the corresponding number of underlying tokens to `account`
    fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
        self._burn(Self::env().caller(), amount)?;
        self.wrapped().transfer(account, amount, Vec::<u8>::new())
    }
}

pub trait WrappedPSP22Internal {
    fn wrapped(&self) -> &PSP22Ref;
}

impl<T: WrappedPSP22Storage> WrappedPSP22Internal for T {
    fn wrapped(&self) -> &PSP22Ref {
        &WrappedPSP22Storage::get(self).wrapped_account
    }
}
