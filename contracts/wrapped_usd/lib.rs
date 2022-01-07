#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]

#[brush::contract]
pub mod wrapped_usd {
    use brush::contracts::psp22::*;
    use usd_wrapper_project::traits::{
        deposit::Deposit,
        withdraw::Withdraw
    };

    #[ink(storage)]
    #[derive(Default, PSP22Storage)]
    pub struct WrappedUsd {
        #[PSP22StorageField]
        psp22: PSP22Data
    }

    impl Withdraw for WrappedUsd {}

    impl Deposit for WrappedUsd {}

    impl PSP22 for WrappedUsd {}

    impl WrappedUsd {
        #[ink(constructor)]
        pub fn new(total_supply: Balance) -> Self {
            let mut instance = Self::default();
            assert!(instance._mint(Self::env().caller(), total_supply).is_ok());
            instance
        }
    }
}
