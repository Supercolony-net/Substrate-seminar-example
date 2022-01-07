use brush::contracts::psp22::{PSP22Error, PSP22Internal, PSP22Storage};
use brush::contracts::psp22::extensions::wrapper::{PSP22WrapperInternal, PSP22WrapperStorage};
use brush::traits::{AccountId, Balance};
use ink_storage::traits::SpreadLayout;
use crate::traits::withdraw::Withdraw;

impl<T: PSP22Storage + PSP22WrapperStorage + SpreadLayout> Withdraw for T {
    default fn withdraw_to(&mut self, account: AccountId, amount: Balance) -> Result<(), PSP22Error> {
        self._burn(Self::env().caller(), amount)?;
        self._withdraw(account, amount)
    }
}
