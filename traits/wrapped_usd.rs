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

#[brush::wrapper]
pub type WrappedPSP22Ref = dyn WrappedPSP22 + PSP22;

#[brush::trait_definition]
pub trait WrappedPSP22: PSP22 + WrappedPSP22Storage + PSP22Internal {
    /// Allow a user to deposit `amount` of underlying tokens and mint `amount` of the wrapped tokens to `account`
    #[ink(message)]
    fn deposit_for(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
        self.wrapped()
            .transfer_from(Self::env().caller(), Self::env().account_id(), amount, Vec::<u8>::new())?;
        self._mint(account, amount)
    }

    /// Allow a user to burn `amount` of wrapped tokens and withdraw the corresponding number of underlying tokens to `account`
    #[ink(message)]
    fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
        self._burn(Self::env().caller(), amount)?;
        self.wrapped().transfer(account, amount, Vec::<u8>::new())
    }

    // internal functions

    fn wrapped(&self) -> &PSP22Ref {
        &WrappedPSP22Storage::get(self).wrapped_account
    }
}
